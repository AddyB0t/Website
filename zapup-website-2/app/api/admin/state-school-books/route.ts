// zapup-website-2/app/api/admin/state-school-books/route.ts
// API endpoint for admin book uploads with chapter support
// Handles book upload with multiple chapters in one request

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
    const title = formData.get('title') as string
    const subjectId = formData.get('subjectId') as string
    const state = formData.get('state') as string
    const school = formData.get('school') as string
    const classLevel = formData.get('classLevel') as string
    const publisher = formData.get('publisher') as string
    const year = formData.get('year') as string
    const description = formData.get('description') as string

    if (!title || !subjectId || !state || !school || !classLevel) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, subjectId, state, school, classLevel' 
      }, { status: 400 })
    }

    // Extract chapters data
    const chapters = []
    let chapterIndex = 0
    
    while (formData.get(`chapters[${chapterIndex}][title]`)) {
      const chapterNumber = formData.get(`chapters[${chapterIndex}][chapterNumber]`) as string
      const chapterTitle = formData.get(`chapters[${chapterIndex}][title]`) as string
      const chapterDescription = formData.get(`chapters[${chapterIndex}][description]`) as string
      const pageStart = formData.get(`chapters[${chapterIndex}][pageStart]`) as string
      const pageEnd = formData.get(`chapters[${chapterIndex}][pageEnd]`) as string
      const chapterFile = formData.get(`chapters[${chapterIndex}][file]`) as File

      if (!chapterNumber || !chapterTitle) {
        return NextResponse.json({ 
          error: `Chapter ${chapterIndex + 1}: Chapter number and title are required` 
        }, { status: 400 })
      }

      const chapterNum = parseInt(chapterNumber)
      if (isNaN(chapterNum) || chapterNum <= 0) {
        return NextResponse.json({ 
          error: `Chapter ${chapterIndex + 1}: Chapter number must be a positive integer` 
        }, { status: 400 })
      }

      // Validate page range if provided
      if (pageStart && pageEnd) {
        const startPage = parseInt(pageStart)
        const endPage = parseInt(pageEnd)
        if (isNaN(startPage) || isNaN(endPage) || startPage > endPage) {
          return NextResponse.json({ 
            error: `Chapter ${chapterIndex + 1}: Invalid page range` 
          }, { status: 400 })
        }
      }

      chapters.push({
        chapterNumber: chapterNum,
        title: chapterTitle,
        description: chapterDescription,
        pageStart: pageStart ? parseInt(pageStart) : null,
        pageEnd: pageEnd ? parseInt(pageEnd) : null,
        file: chapterFile
      })

      chapterIndex++
    }

    // Validate unique chapter numbers
    const chapterNumbers = chapters.map(c => c.chapterNumber)
    const uniqueNumbers = new Set(chapterNumbers)
    if (chapterNumbers.length !== uniqueNumbers.size) {
      return NextResponse.json({ 
        error: 'Chapter numbers must be unique' 
      }, { status: 400 })
    }

    // Generate unique book ID
    const timestamp = Date.now()
    const bookId = `${state.toLowerCase().replace(/\s+/g, '-')}-${school.toLowerCase().replace(/\s+/g, '-')}-${classLevel}-${subjectId}-${timestamp}`

    // Insert book record into state_school_books table
    const { data: book, error: bookError } = await supabase
      .from('state_school_books')
      .insert({
        id: bookId,
        title,
        subject_id: subjectId,
        state,
        school,
        class_level: classLevel,
        publisher: publisher || null,
        year: year ? parseInt(year) : null,
        file_url: null,
        file_name: null,
        file_size: null,
        uploaded_by: userId,
        description: description || null,
        is_active: true
      })
      .select()
      .single()

    if (bookError) {
      console.error('Error inserting book:', bookError)
      return NextResponse.json({ 
        error: 'Failed to save book to database',
        details: bookError.message
      }, { status: 500 })
    }

    // Process chapters if any
    const uploadedChapters = []
    
    for (const chapter of chapters) {
      let fileUrl = null
      let fileName = null
      let fileSize = null

      // Handle chapter file upload if provided
      if (chapter.file) {
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

        if (!allowedTypes.includes(chapter.file.type)) {
          console.error(`Invalid file type for chapter ${chapter.chapterNumber}:`, chapter.file.type)
          // Continue without file upload for this chapter
        } else {
          // Validate file size (25MB max for chapters)
          const maxSize = 25 * 1024 * 1024
          if (chapter.file.size > maxSize) {
            console.error(`File too large for chapter ${chapter.chapterNumber}:`, chapter.file.size)
            // Continue without file upload for this chapter
          } else {
            // Upload file to Supabase storage
            try {
              const chapterId = `${bookId}-ch${chapter.chapterNumber}-${Date.now()}`
              const fileExt = chapter.file.name.split('.').pop()
              const uploadFileName = `${chapterId}.${fileExt}`
              const filePath = `chapters/${uploadFileName}`

              const { error: uploadError } = await supabase.storage
                .from('book-uploads')
                .upload(filePath, chapter.file)

              if (uploadError) {
                console.error('Error uploading chapter file:', uploadError)
                // Continue without file storage
              } else {
                const { data } = supabase.storage
                  .from('book-uploads')
                  .getPublicUrl(filePath)
                fileUrl = data.publicUrl
                fileName = chapter.file.name
                fileSize = chapter.file.size
              }
            } catch (error) {
              console.error('Storage error for chapter file:', error)
              // Continue without file storage
            }
          }
        }
      }

      // Generate chapter ID
      const chapterId = `${bookId}-ch${chapter.chapterNumber}-${Date.now()}`

      // Insert chapter record
      const { data: chapterData, error: chapterError } = await supabase
        .from('state_school_chapters')
        .insert({
          id: chapterId,
          book_id: bookId,
          chapter_number: chapter.chapterNumber,
          title: chapter.title,
          description: chapter.description,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          page_start: chapter.pageStart,
          page_end: chapter.pageEnd,
          uploaded_by: userId,
          is_active: true
        })
        .select()
        .single()

      if (chapterError) {
        console.error('Error inserting chapter:', chapterError)
        // Continue with other chapters - don't fail the entire upload
      } else {
        uploadedChapters.push(chapterData)
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `Book uploaded successfully with ${uploadedChapters.length} chapters`,
      book: book,
      chapters: uploadedChapters
    })

  } catch (error) {
    console.error('Book upload error:', error)
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
    const state = searchParams.get('state')
    const school = searchParams.get('school')
    const classLevel = searchParams.get('classLevel')
    const subjectId = searchParams.get('subjectId')
    const isActive = searchParams.get('isActive')

    let query = supabase
      .from('state_school_books')
      .select('*')
      .order('created_at', { ascending: false })

    if (state) {
      query = query.eq('state', state)
    }
    if (school) {
      query = query.eq('school', school)
    }
    if (classLevel) {
      query = query.eq('class_level', classLevel)
    }
    if (subjectId) {
      query = query.eq('subject_id', subjectId)
    }
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data: books, error } = await query

    if (error) {
      console.error('Error fetching books:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ books })

  } catch (error) {
    console.error('Fetch books error:', error)
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
    const bookId = searchParams.get('id')

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
    }

    // Soft delete - mark as inactive
    const { data: book, error } = await supabase
      .from('state_school_books')
      .update({ is_active: false })
      .eq('id', bookId)
      .select()
      .single()

    if (error) {
      console.error('Error deleting book:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Book deleted successfully',
      book: book
    })

  } catch (error) {
    console.error('Delete book error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred' 
    }, { status: 500 })
  }
} 