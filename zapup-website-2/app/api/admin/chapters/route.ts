// zapup-website-2/app/api/admin/chapters/route.ts
// API endpoints for chapter management
// Handles chapter uploads and management for state_school_books

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bookId = formData.get('bookId') as string
    const chapterNumber = formData.get('chapterNumber') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const pageStart = formData.get('pageStart') as string
    const pageEnd = formData.get('pageEnd') as string

    if (!bookId || !chapterNumber || !title) {
      return NextResponse.json({ 
        error: 'Missing required fields: bookId, chapterNumber, title' 
      }, { status: 400 })
    }

    // Validate chapter number
    const chapterNum = parseInt(chapterNumber)
    if (isNaN(chapterNum) || chapterNum <= 0) {
      return NextResponse.json({ 
        error: 'Chapter number must be a positive integer' 
      }, { status: 400 })
    }

    // Validate page range if provided
    if (pageStart && pageEnd) {
      const startPage = parseInt(pageStart)
      const endPage = parseInt(pageEnd)
      if (startPage > endPage) {
        return NextResponse.json({ 
          error: 'Start page cannot be greater than end page' 
        }, { status: 400 })
      }
    }

    // Check if book exists
    const { data: book, error: bookError } = await supabase
      .from('state_school_books')
      .select('id, title')
      .eq('id', bookId)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ 
        error: 'Book not found' 
      }, { status: 404 })
    }

    // Check if chapter number already exists for this book
    const { data: existingChapter, error: checkError } = await supabase
      .from('state_school_chapters')
      .select('id')
      .eq('book_id', bookId)
      .eq('chapter_number', chapterNum)
      .eq('is_active', true)
      .single()

    if (existingChapter) {
      return NextResponse.json({ 
        error: `Chapter ${chapterNum} already exists for this book` 
      }, { status: 409 })
    }

    // Handle file upload if provided
    let fileUrl = null
    let fileName = null
    let fileSize = null

    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/epub+zip',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ]

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: 'Invalid file type. Only PDF, EPUB, DOC, DOCX, PPT, PPTX, and image files are allowed.' 
        }, { status: 400 })
      }

      // Validate file size (25MB max for chapters)
      const maxSize = 25 * 1024 * 1024
      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: 'File size must be less than 25MB' 
        }, { status: 400 })
      }

      // Generate unique chapter ID
      const chapterId = `${bookId}-ch${chapterNum}-${Date.now()}`

      // Upload file to Supabase storage
      try {
        const fileExt = file.name.split('.').pop()
        const uploadFileName = `${chapterId}.${fileExt}`
        const filePath = `chapters/${uploadFileName}`

        const { error: uploadError } = await supabase.storage
          .from('book-uploads')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Error uploading to Supabase Storage:', uploadError)
          // Continue without file storage - store metadata only
        } else {
          const { data } = supabase.storage
            .from('book-uploads')
            .getPublicUrl(filePath)
          fileUrl = data.publicUrl
          fileName = file.name
          fileSize = file.size
        }
      } catch (error) {
        console.error('Storage error:', error)
        // Continue without file storage - store metadata only
      }
    }

    // Generate chapter ID
    const chapterId = `${bookId}-ch${chapterNum}-${Date.now()}`

    // Insert chapter record into database
    const { data: chapter, error: chapterError } = await supabase
      .from('state_school_chapters')
      .insert({
        id: chapterId,
        book_id: bookId,
        chapter_number: chapterNum,
        title,
        description: description || null,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        page_start: pageStart ? parseInt(pageStart) : null,
        page_end: pageEnd ? parseInt(pageEnd) : null,
        uploaded_by: userId,
        is_active: true
      })
      .select()
      .single()

    if (chapterError) {
      console.error('Error inserting chapter:', chapterError)
      return NextResponse.json({ 
        error: 'Failed to save chapter to database',
        details: chapterError.message
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Chapter uploaded successfully',
      chapter: chapter
    })

  } catch (error) {
    console.error('Chapter upload error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')
    const isActive = searchParams.get('isActive')

    let query = supabase
      .from('state_school_chapters')
      .select(`
        *,
        state_school_books!inner(
          id,
          title,
          state,
          school,
          class_level,
          subject_id
        )
      `)
      .order('chapter_number', { ascending: true })

    if (bookId) {
      query = query.eq('book_id', bookId)
    }
    
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data: chapters, error } = await query

    if (error) {
      console.error('Error fetching chapters:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ chapters })

  } catch (error) {
    console.error('Fetch chapters error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('id')

    if (!chapterId) {
      return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 })
    }

    // Soft delete - mark as inactive
    const { data: chapter, error } = await supabase
      .from('state_school_chapters')
      .update({ is_active: false })
      .eq('id', chapterId)
      .select()
      .single()

    if (error) {
      console.error('Error deleting chapter:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Chapter deleted successfully',
      chapter: chapter
    })

  } catch (error) {
    console.error('Delete chapter error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred' 
    }, { status: 500 })
  }
} 