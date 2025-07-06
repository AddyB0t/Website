import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { userPreferencesService } from '@/lib/supabase';

// GET user preferences
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await userPreferencesService.getUserPreferences(userId);
    
    return NextResponse.json({ 
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST/PUT user preferences (upsert)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const result = await userPreferencesService.upsertUserPreferences({
      user_id: userId,
      ...body
    });

    if (!result) {
      return NextResponse.json({ 
        error: 'Failed to save user preferences'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'User preferences saved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json({ 
      error: 'Failed to save user preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE user preferences
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await userPreferencesService.upsertUserPreferences({
      user_id: userId,
      school_board: undefined,
      class_level: undefined,
      stream: undefined,
      state: undefined,
      school: undefined,
      profile_complete: false
    });

    return NextResponse.json({ 
      success: true,
      message: 'User preferences cleared successfully',
      data: result
    });
  } catch (error) {
    console.error('Error clearing user preferences:', error);
    return NextResponse.json({ 
      error: 'Failed to clear user preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 