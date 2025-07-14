// Website/zapup-website-2/app/api/questions/[classId]/[subjectId]/route.ts
// General API endpoint for questions by class and subject
// Works with the actual database structure using class_id, chapter, and section fields

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  context: { params: { classId: string; subjectId: string } }
) {
  try {
    const awaitedParams = await context.params
    const { classId, subjectId } = awaitedParams
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapter')
    const sectionId = searchParams.get('section')

    // If specific chapter and section requested
    if (chapterId && sectionId) {
      // First, get all chapters to find the one matching the ID
      const { data: allQuestions, error: allError } = await supabase
        .from('questions')
        .select('chapter, section')
        .eq('class_id', classId)

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
        .eq('class_id', classId)
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
          difficulty: q.difficulty || 'medium',
          order_index: q.order_index
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
        .eq('class_id', classId)

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
        .eq('class_id', classId)
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
          difficulty: q.difficulty || 'medium',
          order_index: q.order_index
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

    // Return all chapters for the given class and subject
    const { data: questions, error } = await supabase
      .from('questions')
      .select('chapter, section, id')
      .eq('class_id', classId)

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
      
      const totalQuestions = Array.from(sectionMap.values()).reduce((sum, count) => (sum as number) + (count as number), 0)
      
      return {
        id: chapterName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
        title: chapterName,
        sections,
        totalQuestions
      }
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