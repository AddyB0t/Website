import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image must be less than 10MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExt = image.name.split('.').pop() || 'jpg'
    const fileName = `${timestamp}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const storagePath = `${userId}/${fileName}`

    // Convert File to ArrayBuffer then to Buffer for Supabase
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('student-question-images')
      .upload(storagePath, buffer, {
        contentType: image.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image to storage' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('student-question-images')
      .getPublicUrl(storagePath)

    const publicUrl = urlData.publicUrl

    // Store in uploaded_question_images table (without question_id for Ask page images)
    const { data: dbData, error: dbError } = await supabase
      .from('uploaded_question_images')
      .insert({
        user_id: userId,
        image_url: publicUrl,
        storage_path: storagePath,
        file_name: image.name,
        file_size: image.size,
        analyzed: false
        // question_id is nullable, so we can omit it for Ask page images
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Delete the uploaded file if database insert fails
      await supabase.storage.from('student-question-images').remove([storagePath])
      return NextResponse.json(
        { error: 'Failed to save image metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      imageId: dbData.id
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
