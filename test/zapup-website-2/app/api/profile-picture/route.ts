import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { userPreferencesService } from '@/lib/supabase';

// POST profile picture upload
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Upload to Supabase storage
    const profilePictureUrl = await userPreferencesService.uploadProfilePicture(userId, file);

    if (!profilePictureUrl) {
      return NextResponse.json({ 
        error: 'Failed to upload profile picture'
      }, { status: 500 });
    }

    // Update user preferences with the new profile picture URL
    const result = await userPreferencesService.updateProfilePicture(userId, {
      profile_picture_url: profilePictureUrl,
      profile_picture_filename: file.name,
      profile_picture_size: file.size
    });

    if (!result) {
      return NextResponse.json({ 
        error: 'Failed to save profile picture'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profile_picture_url: profilePictureUrl,
        profile_picture_filename: file.name,
        profile_picture_size: file.size
      }
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json({ 
      error: 'Failed to upload profile picture',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE profile picture
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await userPreferencesService.deleteProfilePicture(userId);

    if (!success) {
      return NextResponse.json({ 
        error: 'Failed to delete profile picture'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Profile picture deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return NextResponse.json({ 
      error: 'Failed to delete profile picture',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 