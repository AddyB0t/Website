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
    
    // Check if user can access this class based on subscription type
    if (!canAccessClass(classNumber, {
      currentClass: preferences.currentClass,
      subscriptionType: preferences.subscriptionType
    })) {
      // Redirect to user's accessible class
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

        {/* Subjects Grid */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card 
                key={subject.id}
                className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleSubjectClick(subject.id)}
              >
                <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-gray-100">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getSubjectIcon(subject.id)}
                      <span className="text-gray-800">{subject.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {getBookTypes().slice(0, 2).map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">{type.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {Math.floor(Math.random() * 5) + 3} Books
                      </Badge>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Download className="w-4 h-4" />
                        <span>PDF Available</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSubjectClick(subject.id)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Books
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
                Please select your stream above to see available books for Class {classNumber}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Books Available</h3>
              <p className="text-gray-500">
                Books for Class {classNumber} are coming soon!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Book Categories */}
        {subjects.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Book Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getBookTypes().map((type) => (
                  <div key={type.id} className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                    <div className="text-xs text-blue-600 mt-2">{type.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
} 