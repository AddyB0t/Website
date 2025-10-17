// API endpoint to sync question_availability table with actual questions data
// This ensures the availability table always reflects the true state of the database

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting question availability sync...')

    // Get all questions grouped by class, subject, and chapter
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('class_id, subject, chapter, section, id')
      .eq('is_active', true)

    if (questionsError) {
      console.error('Error fetching questions:', questionsError)
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    console.log(`📊 Found ${questions.length} total questions`)

    // Group by class_id, subject, chapter, section
    const availabilityMap = new Map<string, {
      class_id: string
      subject: string
      chapter: string
      section: string
      question_count: number
    }>()

    questions.forEach(q => {
      const key = `${q.class_id}|${q.subject}|${q.chapter}|${q.section || 'General'}`

      if (!availabilityMap.has(key)) {
        availabilityMap.set(key, {
          class_id: q.class_id,
          subject: q.subject,
          chapter: q.chapter,
          section: q.section || 'General',
          question_count: 0
        })
      }

      const entry = availabilityMap.get(key)!
      entry.question_count++
    })

    console.log(`📦 Grouped into ${availabilityMap.size} unique sections`)

    // Clear existing question_availability table
    const { error: deleteError } = await supabase
      .from('question_availability')
      .delete()
      .neq('id', 0) // Delete all rows

    if (deleteError) {
      console.error('Error clearing question_availability:', deleteError)
      return NextResponse.json({ error: 'Failed to clear old data' }, { status: 500 })
    }

    console.log('🗑️  Cleared old question_availability data')

    // Insert new data
    const availabilityRecords = Array.from(availabilityMap.values()).map(entry => ({
      class_id: entry.class_id,
      subject: entry.subject,
      chapter: entry.chapter,
      section: entry.section,
      question_count: entry.question_count,
      is_available: entry.question_count > 0,
      last_updated: new Date().toISOString()
    }))

    const { error: insertError } = await supabase
      .from('question_availability')
      .insert(availabilityRecords)

    if (insertError) {
      console.error('Error inserting new data:', insertError)
      return NextResponse.json({ error: 'Failed to insert new data' }, { status: 500 })
    }

    console.log(`✅ Successfully synced ${availabilityRecords.length} records`)

    // Get summary statistics
    const summaryByClass = new Map<string, Map<string, { chapters: Set<string>, totalQuestions: number }>>()

    availabilityRecords.forEach(record => {
      if (!summaryByClass.has(record.class_id)) {
        summaryByClass.set(record.class_id, new Map())
      }

      const classMap = summaryByClass.get(record.class_id)!
      if (!classMap.has(record.subject)) {
        classMap.set(record.subject, { chapters: new Set(), totalQuestions: 0 })
      }

      const subjectData = classMap.get(record.subject)!
      subjectData.chapters.add(record.chapter)
      subjectData.totalQuestions += record.question_count
    })

    const summary = Array.from(summaryByClass.entries()).map(([classId, subjectMap]) => {
      const subjects = Array.from(subjectMap.entries()).map(([subject, data]) => ({
        subject,
        chapters: data.chapters.size,
        questions: data.totalQuestions
      }))

      return { class_id: classId, subjects }
    })

    return NextResponse.json({
      success: true,
      message: 'Question availability synced successfully',
      recordsUpdated: availabilityRecords.length,
      summary
    })

  } catch (error) {
    console.error('Unexpected error during sync:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
