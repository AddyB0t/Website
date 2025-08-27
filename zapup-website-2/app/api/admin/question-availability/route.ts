// zapup-website-2/app/api/admin/question-availability/route.ts
// Background service to check and update question availability every 3 hours
// Makes new questions available when they're uploaded and processed

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface QuestionAvailability {
  class_id: string
  subject: string
  chapter: string
  section: string
  question_count: number
  last_updated: string
  is_available: boolean
}

// GET endpoint to check current availability status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const subject = searchParams.get('subject')

    let query = supabase
      .from('question_availability')
      .select('*')
      .order('last_updated', { ascending: false })

    if (classId) {
      query = query.eq('class_id', classId)
    }
    if (subject) {
      query = query.eq('subject', subject)
    }

    const { data: availability, error } = await query

    if (error) {
      console.error('Error fetching question availability:', error)
      return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
    }

    return NextResponse.json({ 
      availability: availability || [],
      lastCheck: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in question availability GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST endpoint to run the availability check (called by cron job or manually)
export async function POST(request: NextRequest) {
  try {
    console.log('Starting question availability check...')
    
    // Get all current questions grouped by class, subject, chapter, section
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('class_id, subject, chapter, section')

    if (questionsError) {
      console.error('Error fetching questions:', questionsError)
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    // Group questions by class_id, subject, chapter, section
    const availabilityMap = new Map<string, QuestionAvailability>()
    
    questionsData?.forEach(question => {
      const key = `${question.class_id}-${question.subject || 'general'}-${question.chapter}-${question.section || 'general'}`
      
      if (availabilityMap.has(key)) {
        const existing = availabilityMap.get(key)!
        existing.question_count++
      } else {
        availabilityMap.set(key, {
          class_id: question.class_id,
          subject: question.subject || 'general',
          chapter: question.chapter,
          section: question.section || 'general',
          question_count: 1,
          last_updated: new Date().toISOString(),
          is_available: true
        })
      }
    })

    // Update or insert availability records
    const availabilityRecords = Array.from(availabilityMap.values())
    let updatedCount = 0
    let newCount = 0

    for (const record of availabilityRecords) {
      // Check if record already exists
      const { data: existing, error: checkError } = await supabase
        .from('question_availability')
        .select('id, question_count, is_available')
        .eq('class_id', record.class_id)
        .eq('subject', record.subject)
        .eq('chapter', record.chapter)
        .eq('section', record.section)
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing record:', checkError)
        continue
      }

      if (existing) {
        // Update existing record if question count changed or availability status changed
        if (existing.question_count !== record.question_count || !existing.is_available) {
          const { error: updateError } = await supabase
            .from('question_availability')
            .update({
              question_count: record.question_count,
              last_updated: record.last_updated,
              is_available: true
            })
            .eq('id', existing.id)

          if (updateError) {
            console.error('Error updating availability record:', updateError)
          } else {
            updatedCount++
            console.log(`Updated availability for ${record.class_id} ${record.subject} ${record.chapter} ${record.section}`)
          }
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('question_availability')
          .insert(record)

        if (insertError) {
          console.error('Error inserting availability record:', insertError)
        } else {
          newCount++
          console.log(`Added availability for ${record.class_id} ${record.subject} ${record.chapter} ${record.section}`)
        }
      }
    }

    // Also check for removed sections (set them as unavailable)
    const { data: allAvailability, error: allError } = await supabase
      .from('question_availability')
      .select('*')
      .eq('is_available', true)

    if (allError) {
      console.error('Error fetching all availability records:', allError)
    } else {
      let removedCount = 0
      
      for (const existingRecord of allAvailability || []) {
        const key = `${existingRecord.class_id}-${existingRecord.subject}-${existingRecord.chapter}-${existingRecord.section}`
        
        if (!availabilityMap.has(key)) {
          // This section no longer has questions, mark as unavailable
          const { error: removeError } = await supabase
            .from('question_availability')
            .update({
              is_available: false,
              last_updated: new Date().toISOString()
            })
            .eq('id', existingRecord.id)

          if (removeError) {
            console.error('Error marking section unavailable:', removeError)
          } else {
            removedCount++
            console.log(`Marked unavailable: ${existingRecord.class_id} ${existingRecord.subject} ${existingRecord.chapter} ${existingRecord.section}`)
          }
        }
      }

      return NextResponse.json({
        success: true,
        summary: {
          totalSections: availabilityRecords.length,
          updated: updatedCount,
          new: newCount,
          removed: removedCount,
          lastCheck: new Date().toISOString()
        },
        message: `Question availability check completed. ${newCount} new sections, ${updatedCount} updated, ${removedCount} removed.`
      })
    }

  } catch (error) {
    console.error('Error in question availability check:', error)
    return NextResponse.json({ 
      error: 'Question availability check failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// DELETE endpoint to reset availability (for testing)
export async function DELETE(request: NextRequest) {
  try {
    const { error } = await supabase
      .from('question_availability')
      .delete()
      .neq('id', 0) // Delete all records

    if (error) {
      console.error('Error resetting availability:', error)
      return NextResponse.json({ error: 'Failed to reset availability' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Question availability reset successfully'
    })

  } catch (error) {
    console.error('Error resetting availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}