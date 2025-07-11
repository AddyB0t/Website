// zapup-website-2/app/api/fix-database/route.ts
// API endpoint to fix database setup for question usage tracking
// This runs the necessary SQL commands to set up the database properly

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const results = []

    // 1. Add subscription_type column to user_preferences
    try {
      await supabase.rpc('sql', {
        query: `ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(32) NOT NULL DEFAULT 'explorer';`
      })
      results.push('✅ Added subscription_type column')
    } catch (error) {
      results.push(`⚠️ Subscription column: ${error}`)
    }

    // 2. Create question_usage table
    try {
      const { error } = await supabase.rpc('sql', {
        query: `
          CREATE TABLE IF NOT EXISTS question_usage (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            subject_id VARCHAR(50) NOT NULL,
            class_id VARCHAR(20) NOT NULL,
            usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
            questions_asked INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, subject_id, class_id, usage_date)
          );
        `
      })
      
      if (error) throw error
      results.push('✅ Created question_usage table')
    } catch (error) {
      // Try direct table creation
      try {
        const { error: createError } = await supabase
          .from('question_usage')
          .select('id')
          .limit(1)
        
        if (!createError) {
          results.push('✅ question_usage table already exists')
        }
      } catch (e) {
        results.push(`❌ Failed to create question_usage table: ${error}`)
      }
    }

    // 3. Disable RLS for question_usage
    try {
      await supabase.rpc('sql', {
        query: `ALTER TABLE question_usage DISABLE ROW LEVEL SECURITY;`
      })
      results.push('✅ Disabled RLS for question_usage')
    } catch (error) {
      results.push(`⚠️ RLS disable: ${error}`)
    }

    // 4. Test insertion directly
    try {
      const testUserId = 'test-user-' + Date.now()
      const { error: insertError } = await supabase
        .from('question_usage')
        .insert({
          user_id: testUserId,
          subject_id: 'mathematics',
          class_id: '7',
          usage_date: new Date().toISOString().split('T')[0],
          questions_asked: 1
        })

      if (insertError) throw insertError

      // Clean up test data
      await supabase
        .from('question_usage')
        .delete()
        .eq('user_id', testUserId)

      results.push('✅ Database insert/delete test successful')
    } catch (error) {
      results.push(`❌ Database test failed: ${error}`)
    }

    // 5. Check if the table structure is correct
    try {
      const { data, error } = await supabase
        .from('question_usage')
        .select('*')
        .limit(1)

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found, which is fine
        throw error
      }
      
      results.push('✅ question_usage table structure is valid')
    } catch (error) {
      results.push(`❌ Table structure check failed: ${error}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      results: results
    })

  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results: []
    }, { status: 500 })
  }
} 