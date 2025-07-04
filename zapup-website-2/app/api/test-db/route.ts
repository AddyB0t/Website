import { NextRequest, NextResponse } from 'next/server';
import { userPreferencesService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const connectionTest = await userPreferencesService.testConnection();
    
    if (!connectionTest) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Could not connect to Supabase database'
      }, { status: 500 });
    }

    // Test getting user preferences (this will return null if no user found)
    const testUserId = 'test-user-123';
    const preferences = await userPreferencesService.getUserPreferences(testUserId);
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection successful',
      connectionTest,
      testPreferences: preferences,
      environment: {
        SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, ...preferences } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Test creating/updating user preferences
    const result = await userPreferencesService.upsertUserPreferences({
      user_id,
      ...preferences
    });

    return NextResponse.json({ 
      success: true,
      message: 'User preferences saved successfully',
      data: result
    });
  } catch (error) {
    console.error('Database save error:', error);
    return NextResponse.json({ 
      error: 'Failed to save user preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 