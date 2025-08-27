// zapup-website-2/app/questions/[classId]/page.tsx
// Dynamic question page showing subjects based on class selection
// Supports both regular classes (6-10) and stream-based classes (11-12)

'use client'

import { useState, useEffect } from 'react'
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

export default function QuestionClassPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [subjects, setSubjects] = useState<SubjectInfo[]>([])
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([])
  const [selectedStream, setSelectedStream] = useState<string>('')
  const [streams, setStreams] = useState<StreamInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Extract class ID directly (supports both formats: "6", "class-6", "class-6th")
  const classId = params.classId as string
  const classNumber = classId?.replace('class-', '').replace('th', '')

  // Get stream from URL params
  const streamFromUrl = searchParams.get('stream')

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
      const params = new URLSearchParams({
        class: classNumber,
        board: 'CBSE'
      })
      
      const response = await fetch(`/api/questions/available-subjects?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        const availableSubjectIds = data.availableSubjects?.map((s: any) => s.subject) || []
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

  const handleSubjectClick = (subjectId: string, available: boolean) => {
    if (available) {
      const params = new URLSearchParams()
      params.set('board', 'CBSE')
      
      if (isStreamBasedClass(classNumber) && selectedStream) {
        params.set('stream', selectedStream)
      }
      
      router.push(`/questions/${classId}/${subjectId}?${params.toString()}`)
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

  // Filter subjects based on availability
  const categorizeSubjects = () => {
    const available = subjects.filter(subject => availableSubjects.includes(subject.id))
    const comingSoon = subjects.filter(subject => !availableSubjects.includes(subject.id))
    
    return { available, comingSoon }
  }

  const { available: availableSubjectsList, comingSoon: comingSoonSubjects } = categorizeSubjects()
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
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
                          : 'hover:shadow-md border-gray-200'
                      }`}
                      onClick={() => handleStreamChange(stream.id)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{stream.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{stream.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
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

        {/* Available Subjects */}
        {availableSubjectsList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5 text-green-500" />
              <span>Available Now</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSubjectsList.map((subject) => (
                <Card 
                  key={subject.id}
                  className="bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handleSubjectClick(subject.id, true)}
                >
                  <CardHeader className={`bg-gradient-to-br ${subject.bgColor} border-b border-gray-100`}>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-gradient-to-r ${subject.color} rounded-lg text-white`}>
                          {subject.icon}
                        </div>
                        <div>
                          <span className="text-gray-800 font-semibold">{subject.name}</span>
                          <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                            Available
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
                    <Button 
                      className={`w-full bg-gradient-to-r ${subject.color} hover:opacity-90 text-white transition-all duration-200`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSubjectClick(subject.id, true)
                      }}
                    >
                      Start Questions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Subjects */}
        {comingSoonSubjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Coming Soon</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonSubjects.map((subject) => (
                <Card 
                  key={subject.id}
                  className="bg-gray-50 border border-gray-200 opacity-75"
                >
                  <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-300 rounded-lg text-gray-600">
                          {subject.icon}
                        </div>
                        <div>
                          <span className="text-gray-600 font-semibold">{subject.name}</span>
                          <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
                            Coming Soon
                          </Badge>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-sm mb-4">{subject.description}</p>
                    <Button 
                      className="w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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