// Website/zapup-website-2/app/questions/7/mathematics/page.tsx
// Class 7 Mathematics question page with left sidebar chapters/sections and right side questions/answers
// Uses the correct API structure that matches the actual database schema

'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/AppLayout"
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { QuestionChatbot } from "@/components/QuestionChatbot"
import { QuestionUsageDisplay } from "@/components/QuestionUsageDisplay"
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions'

// Answer Section Component
function AnswerSection({ question }: { question: Question | undefined }) {
  const [answer, setAnswer] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usageError, setUsageError] = useState<string | null>(null)
  const [usageLimitReached, setUsageLimitReached] = useState(false)
  const { preferences } = useUserPreferences()

  const generateAnswer = async () => {
    if (!question) return

    setIsGenerating(true)
    setError(null)
    setUsageError(null)
    setUsageLimitReached(false)

    try {
      // Check usage limits first for Explorer plan
      if (preferences.subscriptionType === 'explorer') {
        const checkResponse = await fetch(`/api/question-usage?subject=mathematics&class=7`)
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
          book: 'Mathematics Class 7',
          chapter: 'Current Chapter',
          exercise: 'Current Exercise',
          questionId: question.id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate answer')
      }

      const data = await response.json()
      setAnswer(data.answer)

      // Increment usage for Explorer plan
      if (preferences.subscriptionType === 'explorer') {
        fetch('/api/question-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subjectId: 'mathematics',
            classId: '7'
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
      setAnswer(null)
      setError(null)
    }
  }, [question])

  if (!question) return null

  return (
    <div className="py-4">
      <div className="text-gray-700 mb-4">
        <span className="font-medium">Question {question.order_index}:</span> {question.text}
      </div>
      <div className="text-center py-8">
        <Button 
          onClick={generateAnswer}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isGenerating || usageLimitReached}
        >
          {isGenerating ? 'Generating...' : 'Generate Answer'}
        </Button>
        {usageError && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
            {usageError}
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Generating answer...</span>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {answer && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="font-medium text-green-800 mb-2">Answer:</div>
          <div className="text-gray-700 whitespace-pre-wrap break-words max-w-full overflow-hidden">{answer}</div>
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

export default function Class7MathematicsPage() {
  const router = useRouter()
  const { preferences } = useUserPreferences()
  
  // State for data loading
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for user selections
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())

  // Loading states
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  // Get subscription features
  const subscriptionFeatures = SUBSCRIPTION_FEATURES[preferences.subscriptionType]

  // Load chapters when component mounts
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/questions/7/mathematics')
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
  }, [])

  // Load questions for a specific chapter and section
  const loadQuestions = async (chapterId: string, sectionId: string) => {
    try {
      setLoadingQuestions(true)
      
      const response = await fetch(`/api/questions/7/mathematics?chapter=${chapterId}&section=${sectionId}`)
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
  }

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
    setSelectedSection(sectionId)
    loadQuestions(chapterId, sectionId)
    setSelectedQuestion(null) // Reset question selection
  }

  // Get current chapter data
  const currentChapter = chapters.find(ch => ch.id === selectedChapter)
  const currentSection = currentChapter?.sections.find(s => s.id === selectedSection)
  const currentQuestion = questions.find(q => q.id === selectedQuestion)

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading Class 7 Mathematics questions...</p>
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
                Class 7 →
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Mathematics Questions
              </h1>
            </div>
            
            {/* Usage Display for Explorer Plan */}
            <div className="hidden md:block">
              <QuestionUsageDisplay 
                subjectId="mathematics" 
                classId="7" 
                showInChatbot={false} 
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Sidebar - Chapters */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Chapters</h2>
            </div>
            
            {/* Mobile Usage Display */}
            <div className="md:hidden">
              <QuestionUsageDisplay 
                subjectId="mathematics" 
                classId="7" 
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
                          chapter.sections.map((section) => (
                            <button
                              key={section.id}
                              onClick={() => handleSectionSelect(chapter.id, section.id)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                selectedSection === section.id
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              {section.title}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Center Section - Questions */}
          <div className="flex-1 flex">
            <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedSection ? 
                    currentChapter?.sections.find(s => s.id === selectedSection)?.title || 'Section Questions' :
                    'Section Questions'
                  }
                </h3>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto">
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
                  questions.map((question, idx) => (
                    <button
                      key={question.id}
                      onClick={() => setSelectedQuestion(question.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 mb-3 transition-all ${
                        selectedQuestion === question.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-blue-600 mb-2">
                        Question {idx + 1}:
                      </div>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        {question.text}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Section - Answers */}
            <div className="w-1/2 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-green-50">
                <h3 className="text-lg font-semibold text-gray-900">Answer & Solution</h3>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
                {selectedQuestion ? (
                  <AnswerSection 
                    question={questions.find(q => q.id === selectedQuestion)} 
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      Select a question to view the answer
                    </div>
                    <div className="text-sm text-gray-400">
                      Choose any question from the left panel to see its detailed solution
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot - only show if user has access */}
        {subscriptionFeatures.chatbot && currentQuestion && (
          <QuestionChatbot
            currentQuestion={currentQuestion.text}
            chapterTitle={currentChapter?.title || 'Current Chapter'}
            sectionTitle={currentSection?.title || 'Current Section'}
            questionNumber={currentQuestion.order_index}
            difficulty={currentQuestion.difficulty || 'medium'}
          />
        )}
      </div>
    </AppLayout>
  )
} 