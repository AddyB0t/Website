import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planId,
      billingCycle 
    } = await request.json()

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      )
    }

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id)
    
    if (payment.status !== 'captured') {
      return NextResponse.json(
        { error: 'Payment not captured' },
        { status: 400 }
      )
    }

    // Calculate subscription end date
    const subscriptionEndDate = new Date()
    if (billingCycle === 'annual') {
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1)
    } else {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)
    }

    // Map plan IDs to subscription types
    const subscriptionTypeMap: { [key: string]: string } = {
      'basic': 'scholar',
      'plus': 'achiever',
      'premium': 'genius_plus'
    }

    const subscriptionType = subscriptionTypeMap[planId] || 'explorer'

    // Update user subscription in database
    const { error: updateError } = await supabase
      .from('user_preferences')
      .update({
        subscription_type: subscriptionType,
        subscription_end_date: subscriptionEndDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    // Store payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        razorpay_order_id,
        razorpay_payment_id,
        amount: Number(payment.amount) / 100, // Convert from paise to rupees
        currency: payment.currency,
        plan_id: planId,
        billing_cycle: billingCycle,
        status: 'completed',
        created_at: new Date().toISOString()
      })

    if (paymentError) {
      console.error('Error storing payment record:', paymentError)
      // Don't fail the request if payment storage fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription updated successfully',
      subscriptionType,
      subscriptionEndDate: subscriptionEndDate.toISOString()
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
} 