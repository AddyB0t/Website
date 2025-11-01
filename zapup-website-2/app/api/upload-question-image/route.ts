// API route for uploading question images to Supabase Storage
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { imageStorageService } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from Clerk authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const analyzed = formData.get('analyzed') === 'true';
    const analysisText = formData.get('analysis_text') as string | null;
    const classLevel = formData.get('class_level') as string | null;
    const subject = formData.get('subject') as string | null;
    const tagsString = formData.get('tags') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Parse tags
    const tags = tagsString ? JSON.parse(tagsString) : [];

    // Upload to Supabase
    const result = await imageStorageService.uploadQuestionImage(
      userId,
      file,
      {
        analyzed,
        analysis_text: analysisText || undefined,
        class_level: classLevel || undefined,
        subject: subject || undefined,
        tags
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to upload image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: result.data
    });

  } catch (error) {
    console.error('Error in upload-question-image API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
