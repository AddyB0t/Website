// zapup-website-2/app/api/analyze-image/route.ts
// API endpoint to analyze question images using AI
// Only available for Achiever and Genius+ plan users

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { SUBSCRIPTION_FEATURES, SubscriptionType } from '@/lib/subscriptions'

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
    const { data: userPreferences, error: userError } = await supabase
      .from('user_preferences')
      .select('subscription_type')
      .eq('user_id', userId)
      .single()

    if (userError) {
      return NextResponse.json(
        { error: 'Could not fetch user preferences' },
        { status: 500 }
      )
    }

    const subscriptionType = (userPreferences?.subscription_type || 'explorer') as SubscriptionType
    const features = SUBSCRIPTION_FEATURES[subscriptionType]

    // Check if user has image upload access
    if (!features.imageUpload) {
      return NextResponse.json(
        { 
          error: 'Image upload is only available for Achiever and Genius+ plan users',
          upgrade_required: true,
          current_plan: subscriptionType
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { image, type = 'question-analysis' } = body

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
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

    // Prepare the prompt based on analysis type
    let systemPrompt = ''
    let userPrompt = ''

    if (type === 'question-analysis') {
      systemPrompt = `You are an expert educational assistant specializing in analyzing academic questions from images. Your task is to:

1. Extract and clearly state the question text from the image
2. Identify the subject area (Math, Science, English, etc.)
3. Determine the difficulty level and grade level
4. Provide a step-by-step solution approach
5. Give hints to help the student understand the concept

Format your response clearly with sections for easy reading.`

      userPrompt = `Please analyze this academic question image and provide:

1. **Question Text**: What is the exact question being asked?
2. **Subject & Topic**: What subject and specific topic does this cover?
3. **Solution Approach**: How would you solve this step-by-step?
4. **Key Concepts**: What concepts should the student understand?
5. **Hints**: What hints can help the student solve this themselves?

Please be educational and encouraging in your response.`
    }

    // Call OpenRouter API with vision model
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'ZapUp Image Question Analyzer',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet', // Vision-capable model
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.3, // Lower temperature for more consistent educational responses
      }),
    })

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text()
      console.error('OpenRouter API error:', errorText)
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`)
    }

    const openRouterData = await openRouterResponse.json()
    
    if (!openRouterData.choices || !openRouterData.choices[0] || !openRouterData.choices[0].message) {
      console.error('Invalid response from OpenRouter:', openRouterData)
      throw new Error('Invalid response from OpenRouter')
    }

    const analysis = openRouterData.choices[0].message.content || "Sorry, I couldn't analyze this image. Please ensure it contains a clear academic question."

    // Log the image analysis for analytics (optional)
    try {
      await supabase
        .from('image_analyses')
        .insert({
          user_id: userId,
          analysis_type: type,
          subscription_type: subscriptionType,
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      console.error('Error logging image analysis:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      analysis: analysis,
      type: type,
      subscription_type: subscriptionType
    })

  } catch (error) {
    console.error('Image analysis error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to analyze image',
        details: 'Please try again or contact support if the problem persists'
      },
      { status: 500 }
    )
  }
} 