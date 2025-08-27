// zapup-website-2/app/api/cron/question-availability/route.ts
// Cron endpoint for scheduled question availability updates
// Should be called every 3 hours by a scheduler (Vercel Cron, GitHub Actions, etc.)

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a valid cron source (optional auth)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Cron job triggered: Running question availability check...')

    // Call the question availability endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/admin/question-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'QuestionAvailabilityCron/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Availability check failed with status: ${response.status}`)
    }

    const data = await response.json()
    
    console.log('Question availability check completed:', data.summary)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cron: 'question-availability-check',
      result: data
    })

  } catch (error) {
    console.error('Cron job error:', error)
    
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      cron: 'question-availability-check',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}