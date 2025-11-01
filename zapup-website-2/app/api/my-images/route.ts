// API route for fetching user's uploaded question images
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { imageStorageService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from Clerk authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch images from Supabase
    const result = await imageStorageService.getUserImages(userId, limit, offset);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: result.data || [],
      total: result.count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in my-images GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
