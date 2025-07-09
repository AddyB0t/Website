// zapup-website-2/app/questions/[classId]/page.tsx
// Dynamic question page showing subjects based on class selection
// Supports both regular classes (6-10) and stream-based classes (11-12)

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Brain, BookOpen, Clock, Trophy, ChevronRight, GraduationCap, Star } from 'lucide-react'
import { getSubjectsByClass, isStreamRequired, getSubjectDisplayName } from '@/lib/subjects'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { canAccessClass, getClassAccessRedirectUrl } from '@/lib/access-control'

export default function QuestionClassPage() {
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
    
    // Check if user can access this class based on subscription type
    if (!canAccessClass(classNumber, {
      currentClass: preferences.currentClass,
      subscriptionType: preferences.subscriptionType
    })) {
      // Redirect to user's accessible class
      router.push(`/questions/${preferences.currentClass}`)
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
    router.push(`/questions/${classId}/${subjectId}`)
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

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span>Questions</span>
            <ChevronRight className="w-4 h-4" />
            <span className="capitalize">{classId?.replace('-', ' ')}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <span>Class {classNumber} Questions</span>
          </h1>

        </div>

        {/* Stream Selection for Classes 11-12 */}
        {needsStream && !preferences.stream && (
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <GraduationCap className="w-6 h-6 text-purple-600" />
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

        {/* Subjects Grid */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card 
                key={subject.id}
                className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleSubjectClick(subject.id)}
              >
                <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getSubjectIcon(subject.id)}
                      <span className="text-gray-800">{subject.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSubjectClick(subject.id)
                      }}
                    >
                      Start Questions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : needsStream && !selectedStream ? (
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-12 text-center">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Your Stream</h3>
              <p className="text-gray-500">
                Please select your stream above to see available questions for Class {classNumber}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-12 text-center">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Questions Available</h3>
              <p className="text-gray-500">
                Questions for Class {classNumber} are coming soon!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Section */}
        {subjects.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{subjects.length}</div>
                  <div className="text-sm text-green-600">Subjects Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">0</div>
                  <div className="text-sm text-blue-600">Questions Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-700">0%</div>
                  <div className="text-sm text-purple-600">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">0</div>
                  <div className="text-sm text-orange-600">Streak Days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
} 