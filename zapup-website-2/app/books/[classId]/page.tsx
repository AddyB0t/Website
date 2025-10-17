// zapup-website-2/app/books/[classId]/page.tsx
// Dynamic books page showing subjects based on class selection
// Supports both regular classes (6-10) and stream-based classes (11-12)

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, Download, Eye, ChevronRight, GraduationCap } from 'lucide-react'
import { getSubjectsByClass, isStreamRequired, getSubjectDisplayName } from '@/lib/subjects'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { canAccessClass, getClassAccessRedirectUrl } from '@/lib/access-control'

export default function BooksClassPage() {
  const params = useParams()
  const router = useRouter()
  const { preferences, isProfileComplete } = useUserPreferences()
  const [selectedStream, setSelectedStream] = useState('')
  const [subjects, setSubjects] = useState<Array<{id: string, name: string}>>([])
  
  // Extract class number from classId (e.g., "class-6th" -> "6")
  const classId = params.classId as string
  const classNumber = classId?.replace('class-', '').replace('th', '')

  // Check if user can access this class
  useEffect(() => {
    if (!isProfileComplete()) {
      router.push('/profile')
      return
    }
    // Scholar plan restriction: only allow access to selected class
    if (
      preferences.subscriptionType === 'scholar' &&
      classNumber !== preferences.currentClass
    ) {
      // Optionally, show a toast message here if you have a toast system
      router.push(`/books/class-${preferences.currentClass}th`)
      return
    }

    // Set stream from preferences if available
    if (preferences.stream) {
      setSelectedStream(preferences.stream)
    }
  }, [classNumber, preferences, isProfileComplete, router])
  
  const streams = [
    { value: 'science', label: 'Science (PCM/PCB)' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'arts', label: 'Arts/Humanities' }
  ]

  // Check if this class requires stream selection
  const needsStream = isStreamRequired(classNumber)

  useEffect(() => {
    if (classNumber && (!needsStream || selectedStream)) {
      const classSubjects = getSubjectsByClass(classNumber, selectedStream)
      setSubjects(classSubjects)
    } else if (classNumber && needsStream && !selectedStream) {
      setSubjects([])
    }
  }, [classNumber, selectedStream, needsStream])

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/books/${classId}/${subjectId}`)
  }

  const getSubjectIcon = (subjectId: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      'mathematics': <span className="text-2xl">📊</span>,
      'science': <span className="text-2xl">🔬</span>,
      'physics': <span className="text-2xl">⚛️</span>,
      'chemistry': <span className="text-2xl">🧪</span>,
      'biology': <span className="text-2xl">🧬</span>,
      'english': <span className="text-2xl">📚</span>,
      'hindi': <span className="text-2xl">📖</span>,
      'history': <span className="text-2xl">🏛️</span>,
      'geography': <span className="text-2xl">🌍</span>,
      'economics': <span className="text-2xl">💰</span>,
      'political-science': <span className="text-2xl">🏛️</span>,
      'social-science': <span className="text-2xl">🌍</span>,
      'accountancy': <span className="text-2xl">📊</span>,
      'business-studies': <span className="text-2xl">💼</span>,
      'computer-science': <span className="text-2xl">💻</span>,
      'informatics-practices': <span className="text-2xl">💻</span>,
      'psychology': <span className="text-2xl">🧠</span>,
      'sociology': <span className="text-2xl">👥</span>
    }
    return icons[subjectId] || <BookOpen className="w-6 h-6" />
  }

  const getBookTypes = () => [
    { id: 'ncert', name: 'NCERT', description: 'Official NCERT textbooks', count: '1-2 books' },
    { id: 'reference', name: 'Reference Books', description: 'Additional study materials', count: '2-4 books' },
    { id: 'solutions', name: 'Solution Books', description: 'Step-by-step solutions', count: '1-2 books' },
    { id: 'practice', name: 'Practice Books', description: 'Exercise and practice sets', count: '1-3 books' }
  ]

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span>Books</span>
            <ChevronRight className="w-4 h-4" />
            <span className="capitalize">{classId?.replace('-', ' ')}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span>Class {classNumber} Books</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Access textbooks, reference materials, and study guides for all subjects
          </p>
        </div>

        {/* Stream Selection for Classes 11-12 */}
        {needsStream && !preferences.stream && (
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <GraduationCap className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Select Your Stream</h3>
                  <Select value={selectedStream} onValueChange={setSelectedStream}>
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue placeholder="Choose your stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {streams.map((stream) => (
                        <SelectItem key={stream.value} value={stream.value}>
                          {stream.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coming Soon Message - Books temporarily disabled */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-100 p-4 rounded-full">
                <BookOpen className="w-16 h-16 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Coming Soon</h3>
            <p className="text-gray-600 text-lg mb-2">
              Excel in your board exams with comprehensive Class {classNumber} books. Questions coming soon!
            </p>
            <p className="text-gray-500 text-sm">
              We're preparing high-quality textbooks, reference materials, and study guides for all subjects
            </p>
          </CardContent>
        </Card>

        {/* Book Categories */}
        {subjects.length > 0 && false && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Book Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Removed book type cards */}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
} 