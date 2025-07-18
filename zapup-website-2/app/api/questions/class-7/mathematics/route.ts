import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Chapter mapping for Class 7 Mathematics - based on NCERT curriculum
const chapterOrder: { [key: string]: number } = {
  'Large Number Around Us': 1,
  'Arithmetic Expressions': 2,
  'A Peek Beyond The Point': 3,
  'Expressions Using Letter-Numbers': 4,
  'Parallel And Intersecting Lines': 5,
  'Number Play': 6,
  'A Tale Of Three Intersecting Lines': 7,
  'Working With Fractions': 8
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapter')
    const sectionId = searchParams.get('section')

    // If specific chapter and section requested
    if (chapterId && sectionId) {
      // First, get all chapters to find the one matching the ID
      const { data: allQuestions, error: allError } = await supabase
        .from('questions')
        .select('chapter, section')
        .eq('class_id', '7')

      if (allError) {
        console.error('Error loading questions:', allError)
        return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
      }

      // Find the actual chapter name from the generated ID
      const uniqueChapters = [...new Set(allQuestions.map(q => q.chapter))]
      const actualChapterName = uniqueChapters.find(chapterName => 
        chapterName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === chapterId
      )

      if (!actualChapterName) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
      }

      // Find the actual section name from the generated ID
      const chapterSections = allQuestions
        .filter(q => q.chapter === actualChapterName)
        .map(q => q.section || 'General')
      const uniqueSections = [...new Set(chapterSections)]
      
      const actualSectionName = uniqueSections.find(sectionName => 
        sectionName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === sectionId
      )

      if (!actualSectionName) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 })
      }

      // Get questions for this specific chapter and section
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('class_id', '7')
        .eq('chapter', actualChapterName)
        .eq('section', actualSectionName)
        .order('order_index')

      if (error) {
        console.error('Error loading questions:', error)
        return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
      }

      const section = {
        id: sectionId,
        title: actualSectionName,
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          difficulty: q.difficulty || 'medium'
        }))
      }

      return NextResponse.json({ section })
    }

    // If specific chapter requested
    if (chapterId) {
      // First, get all chapters to find the one matching the ID
      const { data: allQuestions, error: allError } = await supabase
        .from('questions')
        .select('chapter')
        .eq('class_id', '7')

      if (allError) {
        console.error('Error loading chapters:', allError)
        return NextResponse.json({ error: 'Failed to load chapters' }, { status: 500 })
      }

      // Find the actual chapter name from the generated ID
      const uniqueChapters = [...new Set(allQuestions.map(q => q.chapter))]
      const actualChapterName = uniqueChapters.find(chapterName => 
        chapterName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === chapterId
      )

      if (!actualChapterName) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
      }

      // Get all questions for this chapter using the actual chapter name
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('class_id', '7')
        .eq('chapter', actualChapterName)
        .order('section, order_index')

      if (error) {
        console.error('Error loading questions:', error)
        return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
      }

      // Group questions by section
      const sectionMap = new Map()
      questions.forEach(q => {
        const sectionName = q.section || 'General'
        if (!sectionMap.has(sectionName)) {
          sectionMap.set(sectionName, [])
        }
        sectionMap.get(sectionName).push({
          id: q.id,
          text: q.text,
          difficulty: q.difficulty || 'medium'
        })
      })

      // Convert to sections array
      const sections = Array.from(sectionMap.entries()).map(([sectionName, questions]) => ({
        id: sectionName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
        title: sectionName,
        questions
      }))

      const chapter = {
        id: chapterId,
        title: actualChapterName,
        sections,
        totalQuestions: questions.length
      }

      return NextResponse.json({ chapter })
    }

    // Return all chapters for Class 7 Mathematics
    const { data: questions, error } = await supabase
      .from('questions')
      .select('chapter, section, id')
      .eq('class_id', '7')

    if (error) {
      console.error('Error loading questions:', error)
      return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
    }

    // Group by chapter and section
    const chapterMap = new Map()
    questions.forEach(q => {
      const chapterName = q.chapter
      const sectionName = q.section || 'General'
      
      if (!chapterMap.has(chapterName)) {
        chapterMap.set(chapterName, new Map())
      }
      
      const sectionMap = chapterMap.get(chapterName)
      if (!sectionMap.has(sectionName)) {
        sectionMap.set(sectionName, 0)
      }
      
      sectionMap.set(sectionName, sectionMap.get(sectionName) + 1)
    })

    // Convert to chapters array with proper question counts
    const chapters = Array.from(chapterMap.entries()).map(([chapterName, sectionMap]) => {
      const sections = Array.from(sectionMap.entries()).map((entry) => {
        const [sectionName, questionCount] = entry as [string, number]
        return {
          id: sectionName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
          title: sectionName,
          questions: [], // Keep empty for performance
          questionCount: questionCount // Add the actual count here
        }
      })
      
      // Sort sections by their numerical order (extract section numbers)
      sections.sort((a, b) => {
        const getSectionNumber = (title: string) => {
          // Extract section number like "4.1", "1.2", etc.
          const match = title.match(/(\d+)\.(\d+)/)
          if (match) {
            return parseFloat(match[0]) // Returns 4.1, 1.2, etc.
          }
          // If no section number found, put it at the end
          return 999
        }
        
        return getSectionNumber(a.title) - getSectionNumber(b.title)
      })
      
      const totalQuestions = Array.from(sectionMap.values()).reduce((sum, count) => (sum as number) + (count as number), 0)
      
      return {
        id: chapterName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
        title: chapterName,
        sections,
        totalQuestions
      }
    })

    // Sort chapters by their numerical order using the chapter mapping
    chapters.sort((a, b) => {
      const getChapterNumber = (title: string) => {
        // First try to find exact match in our chapter mapping
        if (chapterOrder[title]) {
          return chapterOrder[title]
        }
        
        // Fallback: extract chapter number from titles like "Chapter 1:", "1.", etc.
        const match = title.match(/(?:Chapter\s+)?(\d+)/)
        if (match) {
          return parseInt(match[1])
        }
        
        // If no chapter number found, sort alphabetically at the end
        return 999
      }
      
      const aChapterNum = getChapterNumber(a.title)
      const bChapterNum = getChapterNumber(b.title)
      
      // If both have chapter numbers, sort numerically
      if (aChapterNum !== 999 && bChapterNum !== 999) {
        return aChapterNum - bChapterNum
      }
      
      // If only one has a chapter number, prioritize it
      if (aChapterNum !== 999) return -1
      if (bChapterNum !== 999) return 1
      
      // If neither has a chapter number, sort alphabetically
      return a.title.localeCompare(b.title)
    })

    return NextResponse.json({ chapters })

  } catch (error) {
    console.error('Error loading questions:', error)
    return NextResponse.json(
      { error: 'Failed to load questions' }, 
      { status: 500 }
    )
  }
} 