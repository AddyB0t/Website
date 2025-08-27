// zapup-website-2/hooks/useQuestionAvailability.ts
// Custom hook for checking real-time question availability
// Automatically fetches and updates availability status

'use client'

import { useState, useEffect, useCallback } from 'react'

interface QuestionAvailability {
  class_id: string
  subject: string
  chapter: string
  section: string
  question_count: number
  last_updated: string
  is_available: boolean
}

interface AvailabilityData {
  availability: QuestionAvailability[]
  lastCheck: string
}

interface UseQuestionAvailabilityProps {
  classId?: string
  subject?: string
  refreshInterval?: number // in milliseconds, default 15 minutes
}

export function useQuestionAvailability({
  classId,
  subject,
  refreshInterval = 15 * 60 * 1000 // 15 minutes
}: UseQuestionAvailabilityProps = {}) {
  const [data, setData] = useState<AvailabilityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (classId) params.append('classId', classId)
      if (subject) params.append('subject', subject)

      const response = await fetch(`/api/admin/question-availability?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch question availability')
      }

      const result = await response.json()
      setData(result)
      setLastRefresh(new Date())
      
    } catch (err) {
      console.error('Error fetching question availability:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [classId, subject])

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchAvailability()

    if (refreshInterval > 0) {
      const interval = setInterval(fetchAvailability, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchAvailability, refreshInterval])

  // Helper functions
  const isChapterAvailable = useCallback((chapter: string, section?: string) => {
    if (!data?.availability) return false
    
    return data.availability.some(item => 
      (!classId || item.class_id === classId) &&
      (!subject || item.subject === subject) &&
      item.chapter === chapter &&
      (!section || item.section === section) &&
      item.is_available &&
      item.question_count > 0
    )
  }, [data, classId, subject])

  const getAvailableChapters = useCallback(() => {
    if (!data?.availability) return []
    
    return data.availability
      .filter(item => 
        (!classId || item.class_id === classId) &&
        (!subject || item.subject === subject) &&
        item.is_available &&
        item.question_count > 0
      )
      .reduce((chapters, item) => {
        const existing = chapters.find(ch => ch.chapter === item.chapter)
        if (existing) {
          existing.sections.push({
            section: item.section,
            question_count: item.question_count,
            last_updated: item.last_updated
          })
          existing.total_questions += item.question_count
        } else {
          chapters.push({
            chapter: item.chapter,
            sections: [{
              section: item.section,
              question_count: item.question_count,
              last_updated: item.last_updated
            }],
            total_questions: item.question_count
          })
        }
        return chapters
      }, [] as Array<{
        chapter: string
        sections: Array<{
          section: string
          question_count: number
          last_updated: string
        }>
        total_questions: number
      }>)
  }, [data, classId, subject])

  const getQuestionCount = useCallback((chapter?: string, section?: string) => {
    if (!data?.availability) return 0
    
    return data.availability
      .filter(item => 
        (!classId || item.class_id === classId) &&
        (!subject || item.subject === subject) &&
        (!chapter || item.chapter === chapter) &&
        (!section || item.section === section) &&
        item.is_available
      )
      .reduce((sum, item) => sum + item.question_count, 0)
  }, [data, classId, subject])

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchAvailability()
  }, [fetchAvailability])

  return {
    availability: data?.availability || [],
    lastCheck: data?.lastCheck,
    lastRefresh,
    loading,
    error,
    refresh,
    
    // Helper functions
    isChapterAvailable,
    getAvailableChapters,
    getQuestionCount,
    
    // Status flags
    hasData: !!data,
    isEmpty: !data?.availability || data.availability.length === 0
  }
}