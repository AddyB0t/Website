// zapup-website-2/app/api/question-usage/route.ts
// API endpoint for checking and managing daily question usage limits
// Handles explorer plan's 5 questions per day per subject limit

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { SUBSCRIPTION_FEATURES, SubscriptionType } from '@/lib/subscriptions'

interface UsageResult {
  current_usage: number
  max_allowed: number
  remaining: number
  can_ask: boolean
}

// Function to ensure the question_usage table exists
async function ensureTableExists() {
  try {
    // Try to select from the table first
    const { error } = await supabase
      .from('question_usage')
      .select('id')
      .limit(1)
    
    // If table doesn't exist, this will fail, but that's fine
    // Supabase will handle table creation through migrations
    return true
  } catch (error) {
    console.log('Table may not exist yet:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Ensure table exists by trying to create it
    await ensureTableExists()

    const url = new URL(request.url)
    const subjectId = url.searchParams.get('subject')
    const classId = url.searchParams.get('class')

    if (!subjectId || !classId) {
      return NextResponse.json(
        { error: 'Subject and class parameters are required' },
        { status: 400 }
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

    // Only track usage for Explorer plan - all others get unlimited
    if (subscriptionType !== 'explorer' || features.maxQuestionsPerDay === Infinity) {
      return NextResponse.json({
        current_usage: 0,
        max_allowed: Infinity,
        remaining: Infinity,
        can_ask: true,
        unlimited: true,
        plan: subscriptionType
      })
    }

    // Check current usage using database function (with fallback)
    let usageData: any = null
    let usageError: any = null

    try {
      const result = await supabase
        .rpc('check_question_usage', {
          p_user_id: userId,
          p_subject_id: subjectId,
          p_class_id: classId
        })
      usageData = result.data
      usageError = result.error
    } catch (error) {
      console.error('Database function not available, using direct query:', error)
      
      // Fallback to direct query if function doesn't exist
      const { data: directData, error: directError } = await supabase
        .from('question_usage')
        .select('questions_asked')
        .eq('user_id', userId)
        .eq('subject_id', subjectId)
        .eq('class_id', classId)
        .eq('usage_date', new Date().toISOString().split('T')[0])
        .single()

      if (directError && directError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error with direct query:', directError)
        return NextResponse.json(
          { error: 'Could not check question usage' },
          { status: 500 }
        )
      }

      const currentUsage = directData?.questions_asked || 0
      usageData = [{
        current_usage: currentUsage,
        max_allowed: features.maxQuestionsPerDay,
        remaining: Math.max(0, features.maxQuestionsPerDay - currentUsage),
        can_ask: currentUsage < features.maxQuestionsPerDay
      }]
    }

    if (usageError) {
      console.error('Error checking question usage:', usageError)
      return NextResponse.json(
        { error: 'Could not check question usage' },
        { status: 500 }
      )
    }

    const usage: UsageResult = usageData?.[0] || {
      current_usage: 0,
      max_allowed: features.maxQuestionsPerDay,
      remaining: features.maxQuestionsPerDay,
      can_ask: true
    }

    // Update max_allowed based on actual subscription
    usage.max_allowed = features.maxQuestionsPerDay
    usage.remaining = Math.max(0, features.maxQuestionsPerDay - usage.current_usage)
    usage.can_ask = usage.current_usage < features.maxQuestionsPerDay

    return NextResponse.json(usage)

  } catch (error) {
    console.error('Question usage check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
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

    // Ensure table exists
    await ensureTableExists()

    const body = await request.json()
    const { subjectId, classId } = body

    if (!subjectId || !classId) {
      return NextResponse.json(
        { error: 'Subject and class are required' },
        { status: 400 }
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

    // Only track usage for Explorer plan - all others get unlimited
    if (subscriptionType !== 'explorer' || features.maxQuestionsPerDay === Infinity) {
      return NextResponse.json({
        success: true,
        current_usage: 0,
        max_allowed: Infinity,
        remaining: Infinity,
        can_ask: true,
        unlimited: true,
        plan: subscriptionType
      })
    }

    // Increment usage using database function (with fallback)
    let usageData: any = null
    let usageError: any = null

    try {
      const result = await supabase
        .rpc('increment_question_usage', {
          p_user_id: userId,
          p_subject_id: subjectId,
          p_class_id: classId
        })
      usageData = result.data
      usageError = result.error
    } catch (error) {
      console.error('Database function not available, using direct query:', error)
      
      // Fallback to direct upsert if function doesn't exist
      const today = new Date().toISOString().split('T')[0]
      
      // First, try to get existing record
      const { data: existingData } = await supabase
        .from('question_usage')
        .select('questions_asked')
        .eq('user_id', userId)
        .eq('subject_id', subjectId)
        .eq('class_id', classId)
        .eq('usage_date', today)
        .single()

      const currentUsage = (existingData?.questions_asked || 0) + 1

      // Upsert the record
      const { data: upsertData, error: upsertError } = await supabase
        .from('question_usage')
        .upsert({
          user_id: userId,
          subject_id: subjectId,
          class_id: classId,
          usage_date: today,
          questions_asked: currentUsage
        }, {
          onConflict: 'user_id,subject_id,class_id,usage_date'
        })
        .select('questions_asked')
        .single()

      if (upsertError) {
        console.error('Error with direct upsert:', upsertError)
        return NextResponse.json(
          { error: 'Could not update question usage' },
          { status: 500 }
        )
      }

      usageData = [{
        current_usage: currentUsage,
        max_allowed: features.maxQuestionsPerDay,
        remaining: Math.max(0, features.maxQuestionsPerDay - currentUsage),
        can_ask: currentUsage <= features.maxQuestionsPerDay
      }]
    }

    if (usageError) {
      console.error('Error incrementing question usage:', usageError)
      return NextResponse.json(
        { error: 'Could not update question usage' },
        { status: 500 }
      )
    }

    const usage: UsageResult = usageData?.[0] || {
      current_usage: 1,
      max_allowed: features.maxQuestionsPerDay,
      remaining: features.maxQuestionsPerDay - 1,
      can_ask: false
    }

    // Update max_allowed based on actual subscription
    usage.max_allowed = features.maxQuestionsPerDay
    usage.remaining = Math.max(0, features.maxQuestionsPerDay - usage.current_usage)
    usage.can_ask = usage.current_usage <= features.maxQuestionsPerDay

    // Check if user exceeded limit
    if (usage.current_usage > features.maxQuestionsPerDay) {
      return NextResponse.json(
        { 
          error: 'Daily question limit exceeded',
          ...usage,
          limit_exceeded: true
        },
        { status: 429 }
      )
    }

    return NextResponse.json({
      success: true,
      ...usage
    })

  } catch (error) {
    console.error('Question usage increment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 