import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/question-images/[questionId]
 *
 * Fetch image for a specific question
 * Returns any image linked to this question (user or community)
 * Frontend (Clerk) handles authentication and user-specific logic
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;
    const questionId = parseInt(resolvedParams.questionId);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
    }

    // Get userId from header (sent by frontend if authenticated)
    const userId = request.headers.get('x-user-id');

    // Step 1: Check for user's own image first (if userId provided)
    if (userId) {
      const { data: userImage, error: userError } = await supabase
        .from('uploaded_question_images')
        .select('*')
        .eq('question_id', questionId)
        .eq('user_id', userId)
        .eq('is_community', false)
        .single();

      if (userImage && !userError) {
        console.log(`✅ Found user's own image for question ${questionId} (user: ${userId})`);
        return NextResponse.json({
          image: userImage,
          source: 'user',
          message: 'Your uploaded image'
        });
      }
    }

    // Step 2: Check for community image
    const { data: communityImage, error: communityError } = await supabase
      .from('uploaded_question_images')
      .select('*')
      .eq('question_id', questionId)
      .eq('is_community', true)
      .single();

    if (communityImage && !communityError) {
      console.log(`✅ Found community image for question ${questionId}`);
      return NextResponse.json({
        image: communityImage,
        source: 'community',
        message: 'Community uploaded image'
      });
    }

    // Step 3: Check for ANY image linked to this question (fallback)
    const { data: anyImage, error: anyError } = await supabase
      .from('uploaded_question_images')
      .select('*')
      .eq('question_id', questionId)
      .limit(1)
      .single();

    if (anyImage && !anyError) {
      console.log(`✅ Found image for question ${questionId}`);
      return NextResponse.json({
        image: anyImage,
        source: 'other',
        message: 'Question image available'
      });
    }

    // Step 4: No image found
    console.log(`ℹ️  No image found for question ${questionId}`);
    return NextResponse.json({
      image: null,
      source: null,
      message: 'No image found for this question'
    });

  } catch (error) {
    console.error('Error fetching question image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/question-images/[questionId]
 *
 * Unlink user's image from a question
 * Does not delete the image from storage, just removes the link
 * Frontend must send userId in x-user-id header
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    // Get userId from header (frontend sends this)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required in x-user-id header' },
        { status: 400 }
      );
    }

    // Await params in Next.js 15+
    const resolvedParams = await params;
    const questionId = parseInt(resolvedParams.questionId);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
    }

    // Unlink the image (set question_id to null, keep the image in storage)
    const { data, error } = await supabase
      .from('uploaded_question_images')
      .update({
        question_id: null,
        is_community: false,
        linked_at: null
      })
      .eq('question_id', questionId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error unlinking image:', error);
      return NextResponse.json(
        { error: 'Failed to unlink image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image unlinked successfully',
      unlinked: data?.length || 0
    });

  } catch (error) {
    console.error('Error unlinking question image:', error);
    return NextResponse.json(
      { error: 'Failed to unlink question image' },
      { status: 500 }
    );
  }
}
