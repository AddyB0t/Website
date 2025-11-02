import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/community-image
 *
 * Set an image as the community image for a question
 * Requirements:
 * - User must own the image (user_id must match)
 * - Only one community image allowed per question (enforced by unique index)
 * - Existing community image will be replaced
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imageId, questionId } = await request.json();

    if (!imageId || !questionId) {
      return NextResponse.json(
        { error: 'Missing required fields: imageId and questionId' },
        { status: 400 }
      );
    }

    // Step 1: Verify the user owns this image
    const { data: image, error: verifyError } = await supabase
      .from('uploaded_question_images')
      .select('id, user_id, question_id')
      .eq('id', imageId)
      .eq('user_id', userId)
      .single();

    if (verifyError || !image) {
      return NextResponse.json(
        { error: 'Image not found or you do not have permission to modify it' },
        { status: 404 }
      );
    }

    // Step 2: Check if there's already a community image for this question
    // If so, we'll unlink it (the unique index will prevent insertion otherwise)
    const { data: existingCommunityImage } = await supabase
      .from('uploaded_question_images')
      .select('id')
      .eq('question_id', questionId)
      .eq('is_community', true)
      .single();

    if (existingCommunityImage) {
      console.log(`🔄 Unlinking existing community image for question ${questionId}`);
      await supabase
        .from('uploaded_question_images')
        .update({
          question_id: null,
          is_community: false,
          linked_at: null
        })
        .eq('id', existingCommunityImage.id);
    }

    // Step 3: Set this image as the community image
    const { data: updatedImage, error: updateError } = await supabase
      .from('uploaded_question_images')
      .update({
        question_id: questionId,
        is_community: true,
        linked_at: new Date().toISOString()
      })
      .eq('id', imageId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error setting community image:', updateError);
      return NextResponse.json(
        { error: 'Failed to set community image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image set as community image successfully',
      image: updatedImage
    });

  } catch (error) {
    console.error('Error in community-image API:', error);
    return NextResponse.json(
      { error: 'Failed to set community image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/community-image
 *
 * Remove community status from an image
 * The image remains linked to the question but is now user-specific only
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imageId } = await request.json();

    if (!imageId) {
      return NextResponse.json(
        { error: 'Missing required field: imageId' },
        { status: 400 }
      );
    }

    // Remove community status (keep the question link)
    const { data, error } = await supabase
      .from('uploaded_question_images')
      .update({
        is_community: false
      })
      .eq('id', imageId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error removing community status:', error);
      return NextResponse.json(
        { error: 'Failed to remove community status' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Image not found or you do not have permission to modify it' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Community status removed successfully',
      image: data
    });

  } catch (error) {
    console.error('Error in community-image DELETE API:', error);
    return NextResponse.json(
      { error: 'Failed to remove community status' },
      { status: 500 }
    );
  }
}
