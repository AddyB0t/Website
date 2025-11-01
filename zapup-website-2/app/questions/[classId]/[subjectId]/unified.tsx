'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, AlertCircle, BookOpen, Brain, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/AppLayout"
import { getSubjectDisplayName } from '@/lib/subjects'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

interface Question {
  id: string
  question_text: string
  question_number: number | null
  question_type: string
  difficulty_level: string
  is_example: boolean
  page_number: number | null
  topics: string[]
  keywords: string[]
  chapter_name: string
  chapter_number: number
  book_name: string
  exercise_name: string | null
  school_name: string | null
  school_city: string | null
  school_state: string | null
}

interface ChapterGroup {
  chapter_number: number
  chapter_name: string
  school_name: string | null
  questions: Question[]
}

export default function UnifiedSubjectQuestionsPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.classId as string
  const subjectId = params.subjectId as string
  const { preferences } = useUserPreferences()
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsByChapter, setQuestionsByChapter] = useState<Record<string, ChapterGroup>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [userContext, setUserContext] = useState<any>(null)

  // Extract class number from classId (e.g., "class-8th" -> "8", "8" -> "8")
  const classNumber = classId?.toString().replace('class-', '').replace('th', '')

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Use user context for intelligent filtering
        const params = new URLSearchParams({
          class: classNumber,
          subject: subjectId,
          board: preferences.school_type || 'CBSE',
          limit: '100',
          userStream: 'true' // Use user's stream if available
        })

        const response = await fetch(`/api/questions/unified?${params}`)
        
        if (!response.ok) {
          throw new Error(`Failed to load questions: ${response.statusText}`)
        }
        
        const data = await response.json()
        setQuestions(data.questions || [])
        setQuestionsByChapter(data.questionsByChapter || {})
        setUserContext(data.userContext)
        
        // Auto-select first question
        if (data.questions && data.questions.length > 0) {
          setSelectedQuestion(data.questions[0])
        }
      } catch (err) {
        console.error('Error loading questions:', err)
        setError(err instanceof Error ? err.message : 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }

    if (classNumber && subjectId) {
      loadQuestions()
    }
  }, [classNumber, subjectId, preferences.school_type])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question)
  }

  const generateAnswer = async (question: Question) => {
    try {
      const response = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question_text,
          book: question.book_name,
          chapter: question.chapter_name,
          exercise: question.exercise_name || 'General',
          questionId: question.id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate answer')
      }

      const data = await response.json()
      alert(`Answer: ${data.answer}`) // Simple display for now
    } catch (err) {
      console.error('Error generating answer:', err)
      alert('Failed to generate answer. Please try again.')
    }
  }

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
          <div className="text-center max-w-md">
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
        <div className="bg-white border-b border-gray-200 px-6 py-4">
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
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Class {classNumber}</span>
                <ChevronRight className="w-4 h-4" />
                <span>{getSubjectDisplayName(subjectId)}</span>
              </div>
            </div>
            
            {userContext?.hasPreferences && (
              <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                {userContext.schoolBoard} • {userContext.classLevel} • {userContext.stream || 'General'}
              </div>
            )}
          </div>

          <div className="mt-2">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-600" />
              {getSubjectDisplayName(subjectId)} Questions
            </h1>
            <p className="text-gray-600 mt-1">
              {questions.length} questions available • Click any question to get AI help
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {questions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Available</h3>
                <p className="text-gray-600">
                  No questions found for Class {classNumber} {getSubjectDisplayName(subjectId)}. 
                  Please check back later or contact support.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Questions List */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Questions ({questions.length})
                </h2>
                
                {Object.entries(questionsByChapter).map(([chapterKey, chapter]) => {
                  // Calculate cumulative question number for this chapter
                  let cumulativeQuestionNumber = 0

                  return (
                  <Card key={chapterKey} className="overflow-hidden">
                    <CardHeader className="bg-blue-50 border-b">
                      <CardTitle className="text-sm font-medium text-blue-900">
                        Chapter {chapter.chapter_number}: {chapter.chapter_name}
                        {chapter.school_name && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {chapter.school_name}
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {chapter.questions.map((question, idx) => {
                        cumulativeQuestionNumber++
                        return (
                        <div
                          key={question.id}
                          onClick={() => handleQuestionSelect(question)}
                          className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                            selectedQuestion?.id === question.id
                              ? 'bg-purple-50 border-l-4 border-l-purple-500'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                Q{cumulativeQuestionNumber}
                              </Badge>
                              <Badge className={getDifficultyColor(question.difficulty_level)}>
                                {question.difficulty_level}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {question.question_type}
                              </Badge>
                            </div>
                            {question.page_number && (
                              <Badge variant="outline" className="text-xs">
                                Page {question.page_number}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
                            {question.question_text}
                          </p>
                          
                          {question.exercise_name && (
                            <p className="text-xs text-gray-500 mt-2">
                              {question.exercise_name}
                            </p>
                          )}
                        </div>
                      )
                      })}
                    </CardContent>
                  </Card>
                  )
                })}
              </div>

              {/* Selected Question & AI Help */}
              <div className="lg:sticky lg:top-6">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-600" />
                      AI Question Helper
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedQuestion ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="outline">
                              Q{selectedQuestion.question_number || '1'}
                            </Badge>
                            <Badge className={getDifficultyColor(selectedQuestion.difficulty_level)}>
                              {selectedQuestion.difficulty_level}
                            </Badge>
                            <Badge variant="secondary">
                              {selectedQuestion.question_type}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-800 leading-relaxed">
                            {selectedQuestion.question_text}
                          </p>
                          
                          <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                            <span>Chapter: {selectedQuestion.chapter_name}</span>
                            {selectedQuestion.page_number && (
                              <span>Page {selectedQuestion.page_number}</span>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => generateAnswer(selectedQuestion)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Get AI Help with this Question
                        </Button>
                        
                        <p className="text-xs text-gray-500 text-center">
                          Our AI will provide step-by-step solutions and explanations
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="font-medium text-gray-900 mb-2">Select a Question</h3>
                        <p className="text-sm text-gray-600">
                          Click on any question from the list to get AI-powered help and solutions.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}