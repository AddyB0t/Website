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
    const { classId, subjectId: rawSubjectId } = awaitedParams
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapter')
    const sectionId = searchParams.get('section')

    // Map frontend subject IDs to database subject names
    // Note: Try multiple variations since database might have inconsistent naming
    const subjectNameMap: Record<string, string[]> = {
      'accountancy': ['accountancy', 'accounts'],
      'business-studies': ['business studies', 'business-studies'],
      'environmental-studies': ['environmental studies', 'environmental-studies'],
      'political-science': ['political science', 'political-science']
    }

    // Get possible subject names to try
    const possibleNames = subjectNameMap[rawSubjectId.toLowerCase()] || [rawSubjectId]
    const subjectId = possibleNames[0] // Use first option as primary

    // If specific chapter and section (exercise) requested
    if (chapterId && sectionId) {
      console.log(`📚 Loading chapter: ${chapterId}, section: ${sectionId} for class ${classId}, subject ${subjectId}`)

      // Use new database structure: books -> chapters -> exercises -> questions
      // Step 1: Get books for this class and subject (try all variations)
      let books = null
      let booksError = null

      for (const subjectName of possibleNames) {
        console.log(`  Trying subject name for chapter load: "${subjectName}"`)
        const result = await supabase
          .from('books')
          .select(`
            id,
            subjects!inner(id, name)
          `)
          .eq('class_level', classId)
          .ilike('subjects.name', subjectName)

        if (result.data && result.data.length > 0) {
          books = result.data
          console.log(`  ✅ Found ${books.length} books with subject "${subjectName}"`)
          break
        }
      }

      if (!books) {
        books = []
      }

      console.log(`📚 Found ${books?.length || 0} books for class ${classId}`)

      if (booksError) {
        console.error('Error loading books:', booksError)
        return NextResponse.json({ error: 'Failed to load books' }, { status: 500 })
      }

      if (!books || books.length === 0) {
        console.log(`❌ No books found in database for class ${classId}, subjects: ${possibleNames.join(', ')}`)
        return NextResponse.json({ error: 'No books found for this subject' }, { status: 404 })
      }

      const bookIds = books.map(b => b.id)

      // Step 2: Get chapters for these books
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('id, title')
        .in('book_id', bookIds)

      if (chaptersError) {
        console.error('Error loading chapters:', chaptersError)
        return NextResponse.json({ error: 'Failed to load chapters' }, { status: 500 })
      }

      // Find the chapter that matches the chapterId slug
      let targetChapter = chapters?.find(ch =>
        ch.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === chapterId
      )

      // Special handling for Class 9: If only one chapter and many exercises,
      // the "chapter" might actually be an exercise name
      let targetExercise = null

      if (!targetChapter && classId === '9' && chapters?.length === 1) {
        console.log('🔍 Class 9 special case: Looking for exercise matching chapter ID:', chapterId)

        // Get all exercises from the single chapter
        const { data: allExercises, error: exercisesError } = await supabase
          .from('exercises')
          .select('id, name, exercise_number')
          .eq('chapter_id', chapters[0].id)

        if (!exercisesError && allExercises) {
          // Try to find an exercise that matches the "chapterId"
          const matchingExercise = allExercises.find(ex =>
            ex.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === chapterId
          )

          if (matchingExercise && sectionId === 'questions') {
            // This is a promoted exercise - treat it as both chapter and exercise
            console.log('✅ Found promoted exercise:', matchingExercise.name)
            targetExercise = matchingExercise
            targetChapter = chapters[0] // Use the actual chapter for context
          }
        }
      }

      if (!targetChapter) {
        console.error('Chapter not found:', chapterId, 'Available:', chapters?.map(c => c.title))
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
      }

      // If we haven't already found the exercise (from Class 9 special case), find it normally
      if (!targetExercise) {
        // Step 3: Get exercises for this chapter
        const { data: exercises, error: exercisesError } = await supabase
          .from('exercises')
          .select('id, name, exercise_number')
          .eq('chapter_id', targetChapter.id)

        if (exercisesError) {
          console.error('Error loading exercises:', exercisesError)
          return NextResponse.json({ error: 'Failed to load exercises' }, { status: 500 })
        }

        // Find the exercise that matches the sectionId slug
        targetExercise = exercises?.find(ex =>
          ex.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === sectionId
        )

        if (!targetExercise) {
          console.error('Exercise not found:', sectionId, 'Available:', exercises?.map(e => e.name))
          return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
        }
      }

      // Step 4: Get questions for this exercise
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('exercise_id', targetExercise.id)
        .eq('is_active', true)
        .order('order_index')

      if (questionsError) {
        console.error('Error loading questions:', questionsError)
        return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
      }

      const section = {
        id: sectionId,
        title: targetExercise.name,
        exerciseNumber: targetExercise.exercise_number,
        questions: (questions || []).map(q => ({
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
        .ilike('subject', subjectId)
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
        .eq('class_id', classId)
        .ilike('subject', subjectId)
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

    // Return all chapters for the given class and subject
    // Use RPC or get all unique chapters first to avoid 1000 row limit

    // Step 1: Get all unique exercise IDs with their info through books → subjects
    console.log(`🔍 Looking for books: class_level=${classId}, subject=${subjectId}`)

    // Try all possible subject name variations
    let books = null
    let booksError = null

    for (const subjectName of possibleNames) {
      console.log(`  Trying subject name: "${subjectName}"`)
      const result = await supabase
        .from('books')
        .select(`
          id,
          subjects!inner(id, name)
        `)
        .eq('class_level', classId)
        .ilike('subjects.name', subjectName)

      if (result.data && result.data.length > 0) {
        books = result.data
        console.log(`  ✅ Found ${books.length} books with subject "${subjectName}"`)
        break
      }
    }

    if (!books) {
      books = []
    }

    console.log(`📚 Total books found: ${books.length}`)

    if (booksError) {
      console.error('Error loading books:', booksError)
      return NextResponse.json({ error: 'Failed to load books' }, { status: 500 })
    }

    if (!books || books.length === 0) {
      console.log(`❌ No books found for class ${classId}, subjects: ${possibleNames.join(', ')}`)
      // Try to find what subjects DO exist
      const { data: allSubjects } = await supabase
        .from('subjects')
        .select('name')
        .limit(20)

      console.log('Available subjects in database:', allSubjects?.map(s => s.name).join(', '))

      return NextResponse.json({
        chapters: [],
        debug: {
          searchedFor: { classId, subjectId, triedNames: possibleNames },
          availableSubjects: allSubjects?.map(s => s.name) || []
        }
      })
    }

    // Step 2: Get all chapters for these books
    const bookIds = books.map(b => b.id)
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('id, title, book_id')
      .in('book_id', bookIds)

    if (chaptersError) {
      console.error('Error loading chapters:', chaptersError)
      return NextResponse.json({ error: 'Failed to load chapters' }, { status: 500 })
    }

    if (!chapters || chapters.length === 0) {
      return NextResponse.json({ chapters: [] })
    }

    // Step 3: Get all exercises for these chapters
    const chapterIds = chapters.map(c => c.id)
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('id, name, exercise_number, display_order, chapter_id')
      .in('chapter_id', chapterIds)

    if (exercisesError) {
      console.error('Error loading exercises:', exercisesError)
      return NextResponse.json({ error: 'Failed to load exercises' }, { status: 500 })
    }

    if (!exercises || exercises.length === 0) {
      return NextResponse.json({ chapters: [] })
    }

    // Step 4: Count questions per exercise using aggregate approach
    // Instead of fetching all rows, query each exercise individually to get count
    const questionCountsByExercise = new Map()

    // Process exercises in batches to avoid overwhelming the API
    const batchSize = 50
    for (let i = 0; i < exercises.length; i += batchSize) {
      const batch = exercises.slice(i, i + batchSize)

      // Query count for each exercise in parallel
      const countPromises = batch.map(async (exercise) => {
        const { count, error } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('exercise_id', exercise.id)
          .eq('is_active', true)

        if (error) {
          console.error(`Error counting questions for exercise ${exercise.id}:`, error)
          return { id: exercise.id, count: 0 }
        }

        return { id: exercise.id, count: count || 0 }
      })

      const counts = await Promise.all(countPromises)
      counts.forEach(({ id, count }) => {
        questionCountsByExercise.set(id, count)
      })
    }

    // Map exercises to chapters
    const exercisesByChapter = new Map()
    exercises.forEach(exercise => {
      if (!exercisesByChapter.has(exercise.chapter_id)) {
        exercisesByChapter.set(exercise.chapter_id, [])
      }
      exercisesByChapter.get(exercise.chapter_id).push(exercise)
    })

    // Map chapter IDs to chapter titles
    const chapterTitles = new Map()
    chapters.forEach(chapter => {
      chapterTitles.set(chapter.id, chapter.title)
    })

    // Group by unique chapter title (since we have duplicates)
    const uniqueChapterMap = new Map()

    chapters.forEach(chapter => {
      const chapterTitle = chapter.title

      if (!uniqueChapterMap.has(chapterTitle)) {
        uniqueChapterMap.set(chapterTitle, {
          title: chapterTitle,
          exercises: []
        })
      }

      // Add exercises for this chapter instance
      const chapterExercises = exercisesByChapter.get(chapter.id) || []
      uniqueChapterMap.get(chapterTitle).exercises.push(...chapterExercises)
    })

    // Convert to chapters array with proper exercise information
    const chaptersArray = Array.from(uniqueChapterMap.entries()).map(([chapterTitle, data]) => {
      // Sort exercises by display_order and deduplicate by name
      const uniqueExercises = new Map()

      data.exercises.forEach(exercise => {
        const key = `${exercise.display_order}-${exercise.name}`
        if (!uniqueExercises.has(key)) {
          uniqueExercises.set(key, exercise)
        }
      })

      const sortedExercises = Array.from(uniqueExercises.values())
        .sort((a, b) => a.display_order - b.display_order)

      const sections = sortedExercises.map(exercise => {
        const questionCount = questionCountsByExercise.get(exercise.id) || 0
        return {
          id: exercise.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
          title: exercise.name,
          exerciseNumber: exercise.exercise_number,
          questions: [], // Keep empty for performance
          questionCount
        }
      })

      const totalQuestions = sections.reduce((sum, section) => sum + section.questionCount, 0)

      // Extract chapter number from chapter name (e.g., "Chapter 10: Complex Numbers" -> 10)
      const chapterNumberMatch = chapterTitle.match(/Chapter\s+(\d+)/i)
      const chapterNumber = chapterNumberMatch ? parseInt(chapterNumberMatch[1]) : 9999

      return {
        id: chapterTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
        title: chapterTitle,
        chapterNumber,  // Add chapter number for sorting
        sections,
        totalQuestions
      }
    })
    // Sort chapters by chapter number
    .sort((a, b) => a.chapterNumber - b.chapterNumber)
    // Filter out chapters with no questions
    .filter(chapter => chapter.totalQuestions > 0)

    // Special handling for Class 9: If there's only 1 chapter with many sections,
    // promote each section to be its own chapter
    if (classId === '9' && chaptersArray.length === 1 && chaptersArray[0].sections.length > 10) {
      const originalChapter = chaptersArray[0]
      const promotedChapters = originalChapter.sections.map((section, index) => ({
        id: section.id,
        title: section.title,
        chapterNumber: index + 1,
        sections: [{
          id: 'questions',
          title: 'Questions',
          exerciseNumber: 1,
          questions: [],
          questionCount: section.questionCount
        }],
        totalQuestions: section.questionCount
      }))

      return NextResponse.json({ chapters: promotedChapters })
    }

    return NextResponse.json({ chapters: chaptersArray })

  } catch (error) {
    console.error('Error loading questions:', error)
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    )
  }
} 