import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    
    // Check environment variables
    const hasKeyId = !!process.env.RAZORPAY_KEY_ID
    const hasKeySecret = !!process.env.RAZORPAY_KEY_SECRET
    
    return NextResponse.json({
      status: 'ok',
      authentication: {
        isAuthenticated: !!userId,
        userId: userId || 'Not authenticated'
      },
      razorpay: {
        hasKeyId,
        hasKeySecret,
        keyIdPrefix: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...' : 'Not set',
        keySecretPrefix: process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.substring(0, 10) + '...' : 'Not set'
      },
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 