// zapup-website-2/app/questions/[classId]/page.tsx
// Dynamic question page showing subjects based on class selection
// Supports both regular classes (6-10) and stream-based classes (11-12)

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, BookOpen, ChevronRight, Star, Clock, Users, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import {
  getSubjectsForClass,
  getStreamsForClass,
  getStreamInfo,
  isStreamBasedClass,
  type SubjectInfo,
  type StreamInfo
} from '@/lib/stream-subjects'

function QuestionClassPageContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [subjects, setSubjects] = useState<SubjectInfo[]>([])
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([])
  const [selectedStream, setSelectedStream] = useState<string>('')
  const [streams, setStreams] = useState<StreamInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null)
  
  // Extract class ID directly (supports both formats: "6", "class-6", "class-6th")
  const classId = params.classId as string
  const classNumber = classId?.replace('class-', '').replace('th', '')

  // Get stream from URL params
  const streamFromUrl = searchParams.get('stream')

  // Re-initialize when URL stream parameter changes
  useEffect(() => {
    if (streamFromUrl && streamFromUrl !== selectedStream) {
      setSelectedStream(streamFromUrl)
    }
  }, [streamFromUrl])

  useEffect(() => {
    initializePage()
  }, [classNumber, selectedStream])

  const initializePage = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Check if this is a stream-based class (11/12)
      if (isStreamBasedClass(classNumber)) {
        const availableStreams = getStreamsForClass(classNumber)
        setStreams(availableStreams)
        
        // Set initial stream from URL or default to first stream
        const initialStream = streamFromUrl || (availableStreams.length > 0 ? availableStreams[0].id : '')
        setSelectedStream(initialStream)
        
        if (initialStream) {
          const streamSubjects = getSubjectsForClass(classNumber, initialStream)
          setSubjects(streamSubjects)
        }
      } else {
        // For classes 1-10, get default subjects
        const defaultSubjects = getSubjectsForClass(classNumber)
        setSubjects(defaultSubjects)
        setStreams([])
      }

      // Fetch available subjects from API to check which ones have questions
      await fetchAvailableSubjects()
      
    } catch (err) {
      console.error('Error initializing page:', err)
      setError('Failed to load class information')
    } finally {
      setLoading(false)
    }
  }
  const fetchAvailableSubjects = async () => {
    try {
      // Use ICSE for Class 9-12, CBSE for others
      // Note: Class 11-12 ISC books are actually stored as ICSE in the database
      let boardType = 'CBSE'
      if (classNumber === '9' || classNumber === '10' || classNumber === '11' || classNumber === '12') {
        boardType = 'ICSE (Indian Certificate of Secondary Education)'
      }

      const params = new URLSearchParams({
        class: classNumber,
        board: boardType
      })

      const response = await fetch(`/api/questions/available-subjects?${params}`)

      if (response.ok) {
        const data = await response.json()
        const availableSubjectIds = data.availableSubjects?.map((s: any) => s.subject) || []
        console.log('Available subjects from API:', availableSubjectIds)
        setAvailableSubjects(availableSubjectIds)
      }
    } catch (error) {
      console.error('Error fetching available subjects:', error)
    }
  }

  const handleStreamChange = (streamId: string) => {
    setSelectedStream(streamId)
    
    // Update URL with stream parameter
    const params = new URLSearchParams(searchParams)
    params.set('stream', streamId)
    router.replace(`/questions/${classId}?${params.toString()}`)
  }

  const handleSubjectClick = (subject: SubjectInfo, available: boolean) => {
    // If this subject has sub-subjects (like Lab or English Literature), show them
    if (subject.hasSubSubjects && subject.subSubjects) {
      // Don't navigate, instead show sub-subjects in a modal or expand inline
      setExpandedSubject(subject.id === expandedSubject ? null : subject.id)
      return
    }

    if (available) {
      const params = new URLSearchParams()
      params.set('board', 'CBSE')

      if (isStreamBasedClass(classNumber) && selectedStream) {
        params.set('stream', selectedStream)
      }

      router.push(`/questions/${classId}/${subject.id}?${params.toString()}`)
    }
  }

  const getClassDisplayName = () => {
    const classNum = parseInt(classNumber)
    if (classNum >= 11) {
      return `Class ${classNumber} - Higher Secondary`
    } else if (classNum >= 9) {
      return `Class ${classNumber} - Secondary`
    } else {
      return `Class ${classNumber} - Elementary`
    }
  }

  const getClassDescription = () => {
    const classNum = parseInt(classNumber)
    
    if (classNum >= 11) {
      return `Advanced level curriculum preparing for competitive exams and higher education. Choose your stream to see relevant subjects.`
    } else if (classNum >= 9) {
      return `Secondary level curriculum building strong foundation in core subjects for board examinations.`
    } else {
      return `Elementary level curriculum focusing on fundamental concepts and practical learning across all subjects.`
    }
  }

  // Subject name alias mapping (database name → subject ID)
  const subjectAliases: Record<string, string[]> = {
    'accountancy': ['accounts', 'accountancy'],
    'business-studies': ['business-studies', 'business studies'],
    'environmental-studies': ['environmental-studies', 'environmental studies'],
    'political-science': ['political-science', 'political science']
  }

  // Helper function to check if a subject is available
  const isSubjectAvailable = (subjectId: string): boolean => {
    const normalizedAvailableSubjects = availableSubjects.map(s => s.toLowerCase().replace(/\s+/g, '-'))
    const normalizedId = subjectId.toLowerCase().replace(/\s+/g, '-')

    // Check if subject ID matches directly
    if (normalizedAvailableSubjects.includes(normalizedId)) {
      console.log(`✓ ${subjectId} available (direct match)`)
      return true
    }

    // Check aliases
    const aliases = subjectAliases[normalizedId]
    if (aliases) {
      const matched = aliases.some(alias =>
        normalizedAvailableSubjects.includes(alias.toLowerCase().replace(/\s+/g, '-'))
      )
      if (matched) {
        console.log(`✓ ${subjectId} available (alias match)`)
      }
      return matched
    }

    return false
  }

  console.log('=== RENDER DEBUG ===')
  console.log('Available subjects from API:', availableSubjects)
  console.log('Current subjects:', subjects.map(s => s.id))

  const currentStreamInfo = selectedStream ? getStreamInfo(classNumber, selectedStream) : null

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-96"></div>
            <div className="h-4 bg-gray-300 rounded w-full max-w-2xl"></div>
            {isStreamBasedClass(classNumber) && (
              <div className="h-10 bg-gray-300 rounded w-48"></div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto text-center py-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Class</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Link href="/questions" className="hover:text-blue-600">Questions</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Class {classNumber}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <span>{getClassDisplayName()}</span>
          </h1>
          
          <p className="text-gray-600 mt-2 max-w-3xl">
            {getClassDescription()}
          </p>
        </div>

        {/* Stream Selection for Classes 11-12 */}
        {isStreamBasedClass(classNumber) && streams.length > 0 && (
          <div className="mb-8">
            <Card className="bg-white dark:bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <span>Select Your Academic Stream</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {streams.map((stream) => (
                    <Card
                      key={stream.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedStream === stream.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'hover:shadow-md border-gray-200 bg-white'
                      }`}
                      onClick={() => handleStreamChange(stream.id)}
                    >
                      <CardContent className="p-4">
                        <h3 className={`font-semibold text-lg mb-2 ${
                          selectedStream === stream.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>{stream.name}</h3>
                        <p className={`text-sm mb-3 ${
                          selectedStream === stream.id ? 'text-blue-700' : 'text-gray-600'
                        }`}>{stream.description}</p>
                        <div className={`flex items-center text-sm ${
                          selectedStream === stream.id ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          <BookOpen className="w-4 h-4 mr-1" />
                          {stream.subjects.length} subjects
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {currentStreamInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Selected:</strong> {currentStreamInfo.name} - {currentStreamInfo.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Subjects Grid - Unified Layout matching Books page */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const isAvailable = isSubjectAvailable(subject.id)
              const hasSubSubjects = subject.hasSubSubjects && subject.subSubjects
              const isExpanded = expandedSubject === subject.id

              return (
                <div key={subject.id} className="space-y-4">
                  <Card
                    className={`border border-gray-200 transition-all duration-200 ${
                      hasSubSubjects || isAvailable
                        ? 'bg-white hover:shadow-lg cursor-pointer group'
                        : 'bg-gray-50 opacity-75'
                    }`}
                    onClick={() => handleSubjectClick(subject, isAvailable || hasSubSubjects)}
                  >
                    <CardHeader className={`bg-gradient-to-br ${
                      hasSubSubjects || isAvailable ? subject.bgColor : 'from-gray-50 to-gray-100'
                    } border-b border-gray-100`}>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            hasSubSubjects || isAvailable
                              ? `bg-gradient-to-r ${subject.color} text-white`
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {subject.icon}
                          </div>
                          <span className={`font-semibold ${
                            hasSubSubjects || isAvailable ? 'text-gray-800' : 'text-gray-600'
                          }`}>
                            {subject.name}
                          </span>
                        </div>
                        {(hasSubSubjects || isAvailable) && (
                          <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-all ${
                            isExpanded ? 'rotate-90' : ''
                          }`} />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className={`text-sm mb-4 ${
                        hasSubSubjects || isAvailable ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {subject.description}
                      </p>

                      {hasSubSubjects && (
                        <div className="flex items-center justify-between mb-4">
                          <Badge className='bg-purple-100 text-purple-800 border-purple-200'>
                            {subject.subSubjects?.length} Categories
                          </Badge>
                        </div>
                      )}

                      {/* View Questions Button */}
                      {!hasSubSubjects && (
                        <Button
                          className={`w-full ${
                            isAvailable
                              ? `bg-gradient-to-r ${subject.color} hover:opacity-90 text-white`
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                          disabled={!isAvailable}
                        >
                          {isAvailable ? 'View Questions' : 'Coming Soon'}
                        </Button>
                      )}

                      {hasSubSubjects && (
                        <Button
                          className={`w-full bg-gradient-to-r ${subject.color} hover:opacity-90 text-white`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSubjectClick(subject, isAvailable || hasSubSubjects)
                          }}
                        >
                          {isExpanded ? 'Hide Categories' : 'View Categories'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Sub-subjects (Lab subjects or English variants) */}
                  {isExpanded && hasSubSubjects && (
                    <div className="ml-8 grid grid-cols-1 gap-4 animate-in slide-in-from-top-2">
                      {subject.subSubjects!.map((subSubject) => {
                        const subAvailable = availableSubjects.includes(subSubject.id)
                        return (
                          <Card
                            key={subSubject.id}
                            className={`border-l-4 ${
                              subAvailable
                                ? `border-l-purple-500 bg-white hover:shadow-lg cursor-pointer group`
                                : 'border-l-gray-300 bg-gray-50 opacity-75'
                            }`}
                            onClick={() => subAvailable && handleSubjectClick(subSubject, true)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className={`p-2 rounded-lg ${
                                    subAvailable
                                      ? `bg-gradient-to-r ${subSubject.color} text-white`
                                      : 'bg-gray-300 text-gray-600'
                                  }`}>
                                    {subSubject.icon}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className={`font-semibold ${
                                      subAvailable ? 'text-gray-800' : 'text-gray-600'
                                    }`}>
                                      {subSubject.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">{subSubject.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={
                                    subAvailable
                                      ? 'bg-green-100 text-green-800 border-green-200'
                                      : 'bg-orange-100 text-orange-800 border-orange-200'
                                  }>
                                    {subAvailable ? 'Available' : 'Coming Soon'}
                                  </Badge>
                                  {subAvailable && (
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : null}

        {/* No Subjects Available */}
        {subjects.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Subjects Available
            </h3>
            <p className="text-gray-600 mb-6">
              {isStreamBasedClass(classNumber) 
                ? 'Please select a stream to see available subjects.'
                : 'Questions for this class are coming soon.'
              }
            </p>
            {isStreamBasedClass(classNumber) && streams.length > 0 && !selectedStream && (
              <Button onClick={() => handleStreamChange(streams[0].id)}>
                Select {streams[0].name}
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
} 
export default function QuestionClassPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-96"></div>
            <div className="h-4 bg-gray-300 rounded w-full max-w-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    }>
      <QuestionClassPageContent />
    </Suspense>
  )
}
