import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { SUBSCRIPTION_FEATURES, SubscriptionType } from '@/lib/subscriptions'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get user subscription type
    const { data: userPreferences } = await supabase
      .from('user_preferences')
      .select('subscription_type')
      .eq('user_id', userId)
      .single()

    const subscriptionType = (userPreferences?.subscription_type || 'explorer') as SubscriptionType
    const features = SUBSCRIPTION_FEATURES[subscriptionType]

    // Check if user has chatbot access
    if (!features.chatbot) {
      return NextResponse.json(
        {
          error: 'Chatbot is only available for Achiever and Genius+ plan users',
          upgrade_required: true
        },
        { status: 403 }
      )
    }

    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { message, imageUrl, previousMessages = [] } = body

    // Validate inputs
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { error: 'Image URL is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate message length to prevent abuse
    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message is too long. Maximum 1000 characters allowed.' },
        { status: 400 }
      )
    }

    // Validate and limit previous messages
    if (!Array.isArray(previousMessages)) {
      return NextResponse.json(
        { error: 'Previous messages must be an array' },
        { status: 400 }
      )
    }

    // Check if OpenRouter API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    // Limit previous messages to last 10 to prevent payload bloat
    const limitedPreviousMessages = previousMessages.slice(-10)

    // Prepare messages for AI
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful educational assistant helping students understand and solve their academic questions from images. Be encouraging, clear, and educational. Help them learn rather than just giving answers.'
      },
      ...limitedPreviousMessages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: message
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ]

    // Call OpenRouter API with vision model and timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55000) // 55 second timeout (Vercel has 60s limit)

    let openRouterResponse
    try {
      openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'ZapUp Study Helper',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
        signal: controller.signal
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('AI request timed out. Please try again.')
      }
      throw new Error('Failed to connect to AI service. Please try again.')
    }

    clearTimeout(timeoutId)

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text()
      console.error('OpenRouter API error:', errorText)

      // Handle specific error codes
      if (openRouterResponse.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.')
      } else if (openRouterResponse.status === 401) {
        throw new Error('AI service authentication failed. Please contact support.')
      } else if (openRouterResponse.status >= 500) {
        throw new Error('AI service is temporarily unavailable. Please try again later.')
      }

      throw new Error(`AI service error: ${openRouterResponse.status}`)
    }

    let openRouterData
    try {
      openRouterData = await openRouterResponse.json()
    } catch (jsonError) {
      console.error('Failed to parse OpenRouter response:', jsonError)
      throw new Error('Received invalid response from AI service')
    }

    if (!openRouterData.choices || !openRouterData.choices[0] || !openRouterData.choices[0].message) {
      console.error('Invalid response structure from OpenRouter:', openRouterData)
      throw new Error('Received incomplete response from AI service')
    }

    const response = openRouterData.choices[0].message.content

    if (!response || typeof response !== 'string') {
      throw new Error('AI did not generate a valid response')
    }

    return NextResponse.json({
      success: true,
      response: response
    })

  } catch (error) {
    console.error('Image chat error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process your request',
        details: 'Please try again or contact support if the problem persists'
      },
      { status: 500 }
    )
  }
}
