import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { auth } from '@clerk/nextjs/server'

// Initialize Razorpay instance function
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured')
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Razorpay Order Creation Started ===')
    
    // Check authentication
    const { userId } = await auth()
    console.log('User authentication:', userId ? 'Success' : 'Failed')
    
    if (!userId) {
      console.log('Authentication failed - no userId')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if Razorpay credentials are configured
    const hasKeyId = !!process.env.RAZORPAY_KEY_ID
    const hasKeySecret = !!process.env.RAZORPAY_KEY_SECRET
    
    console.log('Razorpay credentials check:', {
      hasKeyId,
      hasKeySecret,
      keyIdPrefix: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...' : 'Not set'
    })
    
    if (!hasKeyId || !hasKeySecret) {
      console.error('Razorpay credentials not configured')
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    const requestBody = await request.json()
    console.log('Request body received:', requestBody)
    
    const { amount, currency = 'INR', planId, billingCycle } = requestBody

    // Validate required fields
    if (!amount || !planId) {
      console.log('Validation failed:', { amount, planId })
      return NextResponse.json(
        { error: 'Amount and planId are required' },
        { status: 400 }
      )
    }

    // Additional validation
    if (typeof amount !== 'number' || amount <= 0) {
      console.log('Invalid amount:', amount)
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    // Create order options
    const options = {
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency,
      receipt: `${planId}_${Date.now()}`.substring(0, 40), // Ensure receipt is max 40 characters
      notes: {
        userId,
        planId,
        billingCycle: billingCycle || 'monthly',
      },
    }

    console.log('Creating Razorpay order with options:', options)

    // Create order with Razorpay
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create(options)
    
    console.log('Razorpay order created successfully:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Check if it's a Razorpay specific error
    if (error && typeof error === 'object' && 'statusCode' in error) {
      console.error('Razorpay API error:', error)
      return NextResponse.json(
        { error: `Razorpay API error: ${error.statusCode}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
} 