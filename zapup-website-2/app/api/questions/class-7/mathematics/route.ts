import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapter')
    const sectionId = searchParams.get('section')

    // If specific chapter and section (exercise) requested
    if (chapterId && sectionId) {
      // First, get all chapters to find the one matching the ID
      const { data: allQuestions, error: allError } = await supabase
        .from('questions')
        .select(`
          chapter,
          exercises!inner(name)
        `)
        .eq('class_id', '7')
        .ilike('subject', 'mathematics')
        .eq('is_active', true)
        .not('exercise_id', 'is', null)

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

      // Find the actual exercise name from the generated ID
      const chapterExercises = allQuestions
        .filter(q => q.chapter === actualChapterName)
        .map(q => q.exercises?.name || 'General')
      const uniqueExercises = [...new Set(chapterExercises)]

      const actualExerciseName = uniqueExercises.find(exerciseName =>
        exerciseName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === sectionId
      )

      if (!actualExerciseName) {
        return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
      }

      // Get questions for this specific chapter and exercise
      const { data: questions, error } = await supabase
        .from('questions')
        .select(`
          *,
          exercises!inner(name, exercise_number)
        `)
        .eq('class_id', '7')
        .ilike('subject', 'mathematics')
        .eq('chapter', actualChapterName)
        .eq('exercises.name', actualExerciseName)
        .eq('is_active', true)
        .order('order_index')

      if (error) {
        console.error('Error loading questions:', error)
        return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
      }

      const section = {
        id: sectionId,
        title: actualExerciseName,
        exerciseNumber: questions[0]?.exercises?.exercise_number || null,
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
        .eq('class_id', '7')
        .ilike('subject', 'mathematics')
        .eq('is_active', true)

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

      // Get all questions for this chapter with exercise information
      const { data: questions, error } = await supabase
        .from('questions')
        .select(`
          *,
          exercises!inner(name, exercise_number, display_order)
        `)
        .eq('class_id', '7')
        .ilike('subject', 'mathematics')
        .eq('chapter', actualChapterName)
        .eq('is_active', true)
        .not('exercise_id', 'is', null)
        .order('exercises(display_order), order_index')

      if (error) {
        console.error('Error loading questions:', error)
        return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
      }

      // Group questions by exercise
      const exerciseMap = new Map()
      questions.forEach(q => {
        const exerciseName = q.exercises?.name || 'General'
        const exerciseNumber = q.exercises?.exercise_number || 0
        const displayOrder = q.exercises?.display_order || 0
        const exerciseKey = `${displayOrder}-${exerciseName}`

        if (!exerciseMap.has(exerciseKey)) {
          exerciseMap.set(exerciseKey, {
            name: exerciseName,
            number: exerciseNumber,
            displayOrder: displayOrder,
            questions: []
          })
        }

        exerciseMap.get(exerciseKey).questions.push({
          id: q.id,
          text: q.text,
          difficulty: q.difficulty || 'medium',
          order_index: q.order_index
        })
      })

      // Convert to sections array, sorted by display_order
      const sections = Array.from(exerciseMap.entries())
        .sort((a, b) => a[1].displayOrder - b[1].displayOrder)
        .map(([exerciseKey, exerciseData]) => ({
          id: exerciseData.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
          title: exerciseData.name,
          exerciseNumber: exerciseData.number,
          questions: exerciseData.questions
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
    // JOIN with exercises table to get proper exercise names
    const { data: questions, error } = await supabase
      .from('questions')
      .select(`
        chapter,
        id,
        exercise_id,
        exercises!inner(name, exercise_number, display_order)
      `)
      .eq('class_id', '7')
      .ilike('subject', 'mathematics')
      .eq('is_active', true)
      .not('exercise_id', 'is', null)

    if (error) {
      console.error('Error loading questions:', error)
      return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
    }

    // Group by chapter and exercise
    const chapterMap = new Map()
    questions.forEach(q => {
      const chapterName = q.chapter
      const exerciseName = q.exercises?.name || 'General'
      const exerciseNumber = q.exercises?.exercise_number || 0
      const displayOrder = q.exercises?.display_order || 0

      if (!chapterMap.has(chapterName)) {
        chapterMap.set(chapterName, new Map())
      }

      const exerciseMap = chapterMap.get(chapterName)
      const exerciseKey = `${displayOrder}-${exerciseName}` // Use display_order for proper sorting

      if (!exerciseMap.has(exerciseKey)) {
        exerciseMap.set(exerciseKey, {
          name: exerciseName,
          number: exerciseNumber,
          displayOrder: displayOrder,
          count: 0
        })
      }

      exerciseMap.get(exerciseKey).count += 1
    })

    // Convert to chapters array with proper exercise information
    const chapters = Array.from(chapterMap.entries()).map(([chapterName, exerciseMap]) => {
      // Sort exercises by display_order
      const sortedExercises = Array.from(exerciseMap.entries())
        .sort((a, b) => a[1].displayOrder - b[1].displayOrder)

      const sections = sortedExercises.map(([exerciseKey, exerciseData]) => {
        return {
          id: exerciseData.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
          title: exerciseData.name,
          exerciseNumber: exerciseData.number,
          questions: [], // Keep empty for performance
          questionCount: exerciseData.count
        }
      })

      const totalQuestions = sortedExercises.reduce((sum, [_, data]) => sum + data.count, 0)

      // Extract chapter number from chapter name (e.g., "Chapter 10: Complex Numbers" -> 10)
      const chapterNumberMatch = chapterName.match(/Chapter\s+(\d+)/i)
      const chapterNumber = chapterNumberMatch ? parseInt(chapterNumberMatch[1]) : 9999

      return {
        id: chapterName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
        title: chapterName,
        chapterNumber,  // Add chapter number for sorting
        sections,
        totalQuestions
      }
    })
    // Sort chapters by chapter number
    .sort((a, b) => a.chapterNumber - b.chapterNumber)

    return NextResponse.json({ chapters })

  } catch (error) {
    console.error('Error loading questions:', error)
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    )
  }
}
