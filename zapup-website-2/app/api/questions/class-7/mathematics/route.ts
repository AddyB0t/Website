import { NextResponse } from 'next/server'
import { loadClass7MathQuestions, getChapterById, getSectionById } from '@/lib/questions-parser'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapter')
    const sectionId = searchParams.get('section')

    // If specific chapter and section requested
    if (chapterId && sectionId) {
      const section = getSectionById(chapterId, sectionId)
      if (!section) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 })
      }
      return NextResponse.json({ section })
    }

    // If specific chapter requested
    if (chapterId) {
      const chapter = getChapterById(chapterId)
      if (!chapter) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
      }
      return NextResponse.json({ chapter })
    }

    // Return all chapters
    const chapters = loadClass7MathQuestions()
    return NextResponse.json({ chapters })

  } catch (error) {
    console.error('Error loading questions:', error)
    return NextResponse.json(
      { error: 'Failed to load questions' }, 
      { status: 500 }
    )
  }
} 