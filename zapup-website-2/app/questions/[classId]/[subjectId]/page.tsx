// zapup-website-2/app/questions/[classId]/[subjectId]/page.tsx
// Subject-specific question page with left sidebar chapters/exercises and right side questions/answers
// Loads real data from Supabase database using the correct API structure

'use client'

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, ChevronRight, Loader2, AlertCircle, Upload, X, Image as ImageIcon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/AppLayout"
import { getSubjectDisplayName } from '@/lib/subjects'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { QuestionChatbot } from "@/components/QuestionChatbot"
import { QuestionUsageDisplay } from "@/components/QuestionUsageDisplay"
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions'
import { ExerciseBadge } from '@/components/ExerciseBadge'
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

// Answer Section Component
function AnswerSection({ question, subject, classId }: { question: Question | undefined, subject: string, classId: string }) {
  const { user } = useUser()
  const [answer, setAnswer] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { preferences } = useUserPreferences()
  const [usageError, setUsageError] = useState<string | null>(null)
  const [usageLimitReached, setUsageLimitReached] = useState(false)
  const [questionImage, setQuestionImage] = useState<any>(null)
  const [imageSource, setImageSource] = useState<'user' | 'community' | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [displayedAnswer, setDisplayedAnswer] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationIntervalId, setAnimationIntervalId] = useState<NodeJS.Timeout | null>(null)

  const generateAnswer = async () => {
    if (!question) return

    setIsGenerating(true)
    setError(null)
    setUsageError(null)
    setUsageLimitReached(false)

    try {
      // Check usage limits first for Explorer plan
      if (preferences.subscriptionType === 'explorer') {
        const checkResponse = await fetch(`/api/question-usage?subject=${subject}&class=${classId}`)
        if (checkResponse.ok) {
          const usageData = await checkResponse.json()
          if (!usageData.can_ask) {
            setUsageLimitReached(true)
            setUsageError(`You've reached your daily limit of ${usageData.max_allowed} questions. Upgrade to Scholar plan for unlimited questions!`)
            setIsGenerating(false)
            return
          }
        } else {
          setUsageError('Unable to check usage, please try again later.')
        }
      }

      const response = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.text,
          book: `${getSubjectDisplayName(subject)} Class ${classId}`,
          chapter: 'Current Chapter',
          exercise: 'Current Exercise',
          questionId: question.id,
          classLevel: classId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate answer')
      }

      const data = await response.json()
      const fullAnswer = data.answer
      setAnswer(fullAnswer)

      // Clear any existing animation interval
      if (animationIntervalId) {
        clearInterval(animationIntervalId)
      }

      // Start waterfall/typewriter effect
      setIsAnimating(true)
      setDisplayedAnswer('')
      let currentIndex = 0

      const intervalId = setInterval(() => {
        if (currentIndex < fullAnswer.length) {
          setDisplayedAnswer(fullAnswer.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(intervalId)
          setAnimationIntervalId(null)
          setIsAnimating(false)
        }
      }, 20) // 20ms per character

      setAnimationIntervalId(intervalId)

      // Increment usage for Explorer plan
      if (preferences.subscriptionType === 'explorer') {
        fetch('/api/question-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subjectId: subject,
            classId: classId
          }),
        }).catch(err => console.error('Error tracking usage:', err))

        // Trigger usage refresh
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('questionAsked'))
          if ((window as any).refreshQuestionUsage) {
            setTimeout(() => {
              (window as any).refreshQuestionUsage()
            }, 1000)
          }
        }
      }
    } catch (err) {
      console.error('Error generating answer:', err)
      setError('Failed to generate answer. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (question) {
      // Clear any running animation when switching questions
      if (animationIntervalId) {
        clearInterval(animationIntervalId)
        setAnimationIntervalId(null)
      }
      setAnswer(null)
      setError(null)
      setIsAnimating(false)
      setDisplayedAnswer('')
      fetchQuestionImage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (animationIntervalId) {
        clearInterval(animationIntervalId)
      }
    }
  }, [animationIntervalId])

  const fetchQuestionImage = async () => {
    if (!question) return

    try {
      const headers: HeadersInit = {};
      if (user?.id) {
        headers['x-user-id'] = user.id;
      }

      const response = await fetch(`/api/question-images/${question.id}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setQuestionImage(data.image)
        setImageSource(data.source)
      } else {
        setQuestionImage(null)
        setImageSource(null)
      }
    } catch (err) {
      console.error('Error fetching question image:', err)
      setQuestionImage(null)
      setImageSource(null)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const file = event.target.files?.[0]
    if (!file || !question) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('question_id', question.id.toString())
      formData.append('is_community', 'false')
      formData.append('class_level', classId)
      formData.append('subject', subject)

      const response = await fetch('/api/upload-question-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      setQuestionImage(data.image)
      setImageSource('user')
      alert('Image uploaded successfully!')

      // Clear the file input
      event.target.value = ''
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      console.error('Error uploading image:', errorMessage, err)
      alert(`Failed to upload image: ${errorMessage}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!question || !user?.id) return

    if (!confirm('Are you sure you want to remove this image from this question?')) {
      return
    }

    try {
      const headers: HeadersInit = {
        'x-user-id': user.id
      };

      const response = await fetch(`/api/question-images/${question.id}`, {
        method: 'DELETE',
        headers
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to remove image')
      }

      setQuestionImage(null)
      setImageSource(null)
      alert('Image removed successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove image'
      console.error('Error removing image:', errorMessage, err)
      alert(`Failed to remove image: ${errorMessage}`)
    }
  }

  if (!question) return null

  // Allow image upload for all subjects
  const allowImageUpload = true

  return (
    <div className="py-3 sm:py-4">
      <div className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
        <span className="font-medium">Question {question.displayNumber || question.question_number || question.order_index}:</span> {question.text}
      </div>

      {/* Image Upload Section - Only for scientific/mathematical subjects */}
      {allowImageUpload && (
      <div className="border rounded-lg p-3 sm:p-4 bg-white mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-xs sm:text-sm text-gray-700 flex items-center">
            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Question Image
          </h4>
          {imageSource && (
            <Badge variant={imageSource === 'user' ? 'default' : 'secondary'} className="text-xs">
              {imageSource === 'user' ? 'Your Image' : 'Community'}
            </Badge>
          )}
        </div>

        {questionImage ? (
          <div className="space-y-3">
            <div className="relative w-full h-32 sm:h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={questionImage.image_url}
                alt="Question"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs sm:text-sm"
                  disabled={uploadingImage}
                  asChild
                >
                  <span>
                    <Upload className="w-3 h-3 mr-2" />
                    {uploadingImage ? 'Uploading...' : 'Replace Image'}
                  </span>
                </Button>
              </label>
              {imageSource === 'user' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-xs sm:text-sm"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            {imageSource === 'community' && (
              <p className="text-xs text-gray-500 text-center">
                This is a community image. Upload your own to replace it.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs sm:text-sm"
                disabled={uploadingImage}
                asChild
              >
                <span>
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {uploadingImage ? 'Uploading...' : 'Upload Question Image'}
                </span>
              </Button>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Add an image if the question requires a diagram or is incomplete
            </p>
          </div>
        )}
      </div>
      )}

      <div className="text-center py-4 sm:py-8">
        <Button
          onClick={generateAnswer}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base w-full sm:w-auto"
          disabled={isGenerating || usageLimitReached}
        >
          {isGenerating ? 'Generating...' : 'Generate Answer'}
        </Button>
        {usageError && (
          <div className="mt-3 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
            {usageError}
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-6 sm:py-8">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-blue-600" />
          <span className="ml-3 text-sm sm:text-base text-gray-600">Generating answer...</span>
        </div>
      )}

      {error && (
        <div className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          {error}
        </div>
      )}

      {answer && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 overflow-x-auto">
          <div className="font-medium text-green-800 mb-2 text-sm sm:text-base">Answer:</div>
          <div className="text-gray-700 whitespace-pre-wrap text-xs sm:text-sm break-words">
            {isAnimating ? displayedAnswer : answer}
            {isAnimating && <span className="inline-block w-0.5 h-4 bg-green-600 animate-pulse ml-0.5" />}
          </div>
        </div>
      )}
    </div>
  )
}

// Interface definitions
interface Question {
  id: number
  text: string
  difficulty?: string
  order_index: number
  question_number?: number | null
  exercise_name?: string | null
  exercise_number?: string | null
  displayNumber?: number // For consistent numbering across the UI
}

interface Section {
  id: string
  title: string
  questions: Question[]
  questionCount?: number
}

interface Chapter {
  id: string
  title: string
  sections: Section[]
  totalQuestions: number
}

export default function SubjectQuestionsPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.classId as string
  const subjectId = params.subjectId as string
  const { preferences } = useUserPreferences()
  
  // State for data loading
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for user selections - use combined key for section to avoid conflicts across chapters
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(null) // Format: "chapterId:sectionId"
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Loading states
  const [loadingSections, setLoadingSections] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  // Get subscription features
  const subscriptionFeatures = SUBSCRIPTION_FEATURES[preferences.subscriptionType]

  // Load questions for a specific chapter and section
  const loadQuestions = useCallback(async (chapterId: string, sectionId: string) => {
    try {
      setLoadingQuestions(true)

      const response = await fetch(`/api/questions/${classId}/${subjectId}?chapter=${chapterId}&section=${sectionId}`)
      if (!response.ok) {
        throw new Error('Failed to load questions')
      }

      const data = await response.json()
      setQuestions(data.section?.questions || [])

      // Auto-select first question
      if (data.section?.questions && data.section.questions.length > 0) {
        setSelectedQuestion(data.section.questions[0].id)
      }
    } catch (err) {
      console.error('Error loading questions:', err)
      setQuestions([])
    } finally {
      setLoadingQuestions(false)
    }
  }, [classId, subjectId])

  // Load chapters when component mounts
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/questions/${classId}/${subjectId}`)
        if (!response.ok) {
          throw new Error('Failed to load chapters')
        }

        const data = await response.json()
        setChapters(data.chapters || [])

        // Auto-expand first chapter and load its sections
        if (data.chapters && data.chapters.length > 0) {
          const firstChapter = data.chapters[0]
          setExpandedChapters(new Set([firstChapter.id]))
          setSelectedChapter(firstChapter.id)

          // Auto-select first section if available
          if (firstChapter.sections && firstChapter.sections.length > 0) {
            const firstSection = firstChapter.sections[0]
            setSelectedSection(firstSection.id)
            setSelectedSectionKey(`${firstChapter.id}:${firstSection.id}`)
            await loadQuestions(firstChapter.id, firstSection.id)
          }
        }
      } catch (err) {
        console.error('Error loading chapters:', err)
        setError(err instanceof Error ? err.message : 'Failed to load chapters')
      } finally {
        setLoading(false)
      }
    }

    loadChapters()
  }, [classId, subjectId, loadQuestions])

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
      setSelectedChapter(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const handleSectionSelect = (chapterId: string, sectionId: string) => {
    setSelectedChapter(chapterId)
    setSelectedSection(sectionId)
    setSelectedSectionKey(`${chapterId}:${sectionId}`) // Unique key combining chapter and section
    loadQuestions(chapterId, sectionId)
    setSelectedQuestion(null) // Reset question selection
  }

  // Get current chapter data - use selectedChapter to ensure we're looking in the right chapter
  const currentChapter = chapters.find(ch => ch.id === selectedChapter)
  const currentSection = currentChapter?.sections.find(s => s.id === selectedSection)
  const currentSectionIndex = currentChapter?.sections.findIndex(s => s.id === selectedSection) ?? -1
  const currentQuestion = questions.find(q => q.id === selectedQuestion)

  // Calculate the display title for the current section (matching sidebar logic)
  const getCurrentSectionDisplayTitle = () => {
    if (!currentSection || currentSectionIndex < 0) return 'Section Questions'
    const displayExerciseNumber = currentSectionIndex + 1
    const exerciseName = currentSection.title.replace(/^Exercise\s+\d+\s*-?\s*/i, '')
    return `Exercise ${displayExerciseNumber} - ${exerciseName}`
  }
  
  // Add display number to current question
  const currentQuestionWithDisplay = currentQuestion ? {
    ...currentQuestion,
    displayNumber: currentQuestion.question_number || 
                   (questions.findIndex(q => q.id === selectedQuestion) + 1)
  } : undefined

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading {getSubjectDisplayName(subjectId)} questions...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Questions</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
              onClick={() => router.back()} 
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="text-sm text-gray-500">
                Class {classId} →
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {getSubjectDisplayName(subjectId)} Questions
              </h1>
            </div>
            
            {/* Usage Display for Explorer Plan */}
            <div className="hidden md:block">
              <QuestionUsageDisplay 
                subjectId={subjectId} 
                classId={classId} 
                showInChatbot={false} 
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-73px)] relative">
          {/* Left Sidebar - Chapters */}
          <div className={`bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? 'w-0 opacity-0' : 'w-80 opacity-100'
          }`}>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Chapters</h2>
            </div>
            
            {/* Mobile Usage Display */}
            <div className="md:hidden">
              <QuestionUsageDisplay 
                subjectId={subjectId} 
                classId={classId} 
                showInChatbot={false} 
              />
            </div>
            
            <div className="p-4">
              {chapters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No chapters available</p>
                </div>
              ) : (
                chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-2">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {chapter.title}
                      </span>
                      {expandedChapters.has(chapter.id) ? 
                        <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      }
                    </button>
                    
                    {expandedChapters.has(chapter.id) && (
                      <div className="ml-4 mt-2 space-y-1">
                        {chapter.sections.length === 0 ? (
                          <p className="text-gray-500 text-sm px-2 py-1">No sections available</p>
                        ) : (
                          chapter.sections.map((section, sectionIndex) => {
                            // Generate sequential exercise number in frontend
                            const displayExerciseNumber = sectionIndex + 1
                            // Extract the exercise name without the number prefix
                            // E.g., "Exercise 5 - Programming Questions" -> "Programming Questions"
                            const exerciseName = section.title.replace(/^Exercise\s+\d+\s*-?\s*/i, '')
                            const displayTitle = `Exercise ${displayExerciseNumber} - ${exerciseName}`
                            // Create unique key for this section
                            const sectionKey = `${chapter.id}:${section.id}`

                            return (
                              <button
                                key={section.id}
                                onClick={() => handleSectionSelect(chapter.id, section.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                  selectedSectionKey === sectionKey
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                {displayTitle}
                              </button>
                            )
                          })
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Center Section - Questions */}
          <div className="flex-1 flex flex-col md:flex-row">
            <div className={`bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col transition-all duration-300 ${
              isSidebarCollapsed ? 'hidden' : 'w-full md:w-1/2'
            }`}>
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {getCurrentSectionDisplayTitle()}
                </h3>
              </div>

              <div className="p-3 sm:p-4 flex-1 overflow-y-auto max-h-[50vh] md:max-h-none">
                {loadingQuestions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-600">Loading questions...</span>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {selectedSection ? 'No questions available for this section' : 'Select a section to view questions'}
                    </p>
                  </div>
                ) : (
                  questions.map((question, idx) => {
                    // Ensure consistent numbering
                    const questionWithDisplay = {
                      ...question,
                      displayNumber: question.question_number || (idx + 1)
                    };
                    
                    return (
                      <button
                        key={question.id}
                        onClick={() => {
                          setSelectedQuestion(question.id)
                          setIsSidebarCollapsed(true) // Auto-collapse sidebar when question is selected
                        }}
                        className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 mb-2 sm:mb-3 transition-all ${
                          selectedQuestion === question.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
                          <div className="font-medium text-blue-600 text-sm sm:text-base">
                            Question {questionWithDisplay.displayNumber}:
                          </div>
                          <ExerciseBadge
                            exerciseName={question.exercise_name}
                            exerciseNumber={question.exercise_number}
                            variant="secondary"
                            className="text-xs"
                          />
                        </div>
                        <div className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                          {question.text}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Right Section - Answers */}
            <div className={`bg-white flex flex-col transition-all duration-300 ${
              isSidebarCollapsed ? 'w-full' : 'w-full md:w-1/2'
            }`}>
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-green-50 flex-shrink-0 flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Answer & Solution</h3>
                {/* Sidebar Toggle Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hover:bg-green-100"
                  title={isSidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {selectedQuestion ? (
                  <AnswerSection
                    question={currentQuestionWithDisplay}
                    subject={subjectId}
                    classId={classId}
                  />
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">
                      Select a question to view the answer
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 px-4">
                      Choose any question from the {' '}
                      <span className="md:hidden">above</span>
                      <span className="hidden md:inline">left</span>
                      {' '}panel to see its detailed solution
                    </div>
                  </div>
                )}
              </div>
            </div>
                </div>
        </div>

        {/* Chatbot - only show if user has access */}
        {subscriptionFeatures.chatbot && currentQuestionWithDisplay && (
          <QuestionChatbot
            currentQuestion={currentQuestionWithDisplay.text}
            chapterTitle={currentChapter?.title || 'Current Chapter'}
            sectionTitle={currentSection?.title || 'Current Section'}
            questionNumber={currentQuestionWithDisplay.displayNumber || currentQuestionWithDisplay.order_index}
            difficulty={currentQuestionWithDisplay.difficulty || 'medium'}
          />
        )}
      </div>
    </AppLayout>
  )
} 