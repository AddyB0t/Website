'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  Brain, 
  BookOpen, 
  ChevronRight, 
  ArrowLeft, 
  FileText,
  Play,
  Clock,
  Star,
  Trophy,
  Loader2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { QuestionChatbot } from '@/components/QuestionChatbot'

interface Question {
  id: number
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Section {
  id: string
  title: string
  questions: Question[]
  questionCount?: number // Add optional questionCount property
}

interface Chapter {
  id: string
  title: string
  sections: Section[]
  totalQuestions: number
}

export default function Class7MathematicsPage() {
  const [chaptersData, setChaptersData] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [sectionQuestions, setSectionQuestions] = useState<Question[]>([])
  const [loadingSection, setLoadingSection] = useState(false)

  // Load chapters data from API
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/questions/class-7/mathematics')
        if (!response.ok) {
          throw new Error('Failed to load questions')
        }
        const data = await response.json()
        setChaptersData(data.chapters || [])
      } catch (err) {
        console.error('Error loading questions:', err)
        setError(err instanceof Error ? err.message : 'Failed to load questions')
        setChaptersData([])
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  // Load section questions when section is selected
  const loadSectionQuestions = async (chapterId: string, sectionId: string) => {
    try {
      setLoadingSection(true)
      setSectionQuestions([])
      const response = await fetch(`/api/questions/class-7/mathematics?chapter=${encodeURIComponent(chapterId)}&section=${encodeURIComponent(sectionId)}`)
      if (!response.ok) {
        throw new Error('Failed to load section questions')
      }
      const data = await response.json()
      setSectionQuestions(data.section?.questions || [])
    } catch (err) {
      console.error('Error loading section questions:', err)
      setSectionQuestions([])
    } finally {
      setLoadingSection(false)
    }
  }

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId)
    setCurrentQuestion(0)
    if (selectedChapter) {
      loadSectionQuestions(selectedChapter, sectionId)
    }
  }

  const selectedChapterData = chaptersData.find(ch => ch.id === selectedChapter)
  const selectedSectionData = selectedChapterData?.sections.find(sec => sec.id === selectedSection)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalQuestions = chaptersData.reduce((sum, chapter) => sum + chapter.totalQuestions, 0)

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading Class 7 Mathematics questions...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Questions</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  // No data state
  if (chaptersData.length === 0) {
    return (
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Questions Available</h2>
              <p className="text-gray-600">
                Class 7 Mathematics questions are not available at the moment.
              </p>
            </div>
          </div>
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
            <Link href="/questions/7" className="hover:text-blue-600">Class 7</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Mathematics</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <span>Mathematics</span>
          </h1>
        </div>

        {!selectedChapter ? (
          /* Chapter Selection */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {chaptersData.map((chapter, index) => {
                const colors = [
                  { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', light: 'bg-purple-50' },
                  { bg: 'bg-pink-500', hover: 'hover:bg-pink-600', light: 'bg-pink-50' },
                  { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', light: 'bg-blue-50' },
                  { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', light: 'bg-indigo-50' },
                  { bg: 'bg-teal-500', hover: 'hover:bg-teal-600', light: 'bg-teal-50' },
                  { bg: 'bg-green-500', hover: 'hover:bg-green-600', light: 'bg-green-50' },
                  { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', light: 'bg-orange-50' },
                  { bg: 'bg-red-500', hover: 'hover:bg-red-600', light: 'bg-red-50' },
                ]
                const color = colors[index % colors.length]
                
                const getDifficultyLabel = (totalQuestions: number) => {
                  if (totalQuestions > 120) return { label: 'Hard', color: 'bg-red-100 text-red-800' }
                  if (totalQuestions > 100) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' }
                  return { label: 'Easy', color: 'bg-green-100 text-green-800' }
                }
                
                const difficulty = getDifficultyLabel(chapter.totalQuestions)
                
                return (
                  <Card 
                    key={chapter.id}
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-none rounded-lg bg-white"
                    onClick={() => setSelectedChapter(chapter.id)}
                  >
                    <CardContent className="p-0">
                      <div className={`${color.light} p-8 relative text-center`}>
                        <div className={`w-16 h-16 ${color.bg} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                          <span className="text-2xl font-bold text-white">{index + 1}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-xl mb-2 leading-tight">
                          {chapter.title}
                        </h3>
                        <Badge className={`${difficulty.color} text-sm mb-4`}>
                          {difficulty.label}
                        </Badge>
                        <Button 
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-10 px-4 py-2 w-full text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedChapter(chapter.id)
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          <span>Start Questions</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : !selectedSection ? (
          /* Section Selection */
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedChapter(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Chapters</span>
              </Button>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedChapterData?.title}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {selectedChapterData?.sections.map((section, index) => {
                // Different color schemes for sections
                const colorSchemes = [
                  { bg: 'bg-gradient-to-r from-blue-50 to-blue-100', border: 'border-blue-200', icon: 'bg-blue-100', iconText: 'text-blue-600', badge: 'bg-blue-100 text-blue-800 border-blue-200', hover: 'hover:from-blue-100 hover:to-blue-150' },
                  { bg: 'bg-gradient-to-r from-green-50 to-green-100', border: 'border-green-200', icon: 'bg-green-100', iconText: 'text-green-600', badge: 'bg-green-100 text-green-800 border-green-200', hover: 'hover:from-green-100 hover:to-green-150' },
                  { bg: 'bg-gradient-to-r from-purple-50 to-purple-100', border: 'border-purple-200', icon: 'bg-purple-100', iconText: 'text-purple-600', badge: 'bg-purple-100 text-purple-800 border-purple-200', hover: 'hover:from-purple-100 hover:to-purple-150' },
                  { bg: 'bg-gradient-to-r from-orange-50 to-orange-100', border: 'border-orange-200', icon: 'bg-orange-100', iconText: 'text-orange-600', badge: 'bg-orange-100 text-orange-800 border-orange-200', hover: 'hover:from-orange-100 hover:to-orange-150' },
                  { bg: 'bg-gradient-to-r from-pink-50 to-pink-100', border: 'border-pink-200', icon: 'bg-pink-100', iconText: 'text-pink-600', badge: 'bg-pink-100 text-pink-800 border-pink-200', hover: 'hover:from-pink-100 hover:to-pink-150' },
                  { bg: 'bg-gradient-to-r from-indigo-50 to-indigo-100', border: 'border-indigo-200', icon: 'bg-indigo-100', iconText: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', hover: 'hover:from-indigo-100 hover:to-indigo-150' },
                  { bg: 'bg-gradient-to-r from-teal-50 to-teal-100', border: 'border-teal-200', icon: 'bg-teal-100', iconText: 'text-teal-600', badge: 'bg-teal-100 text-teal-800 border-teal-200', hover: 'hover:from-teal-100 hover:to-teal-150' },
                  { bg: 'bg-gradient-to-r from-emerald-50 to-emerald-100', border: 'border-emerald-200', icon: 'bg-emerald-100', iconText: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', hover: 'hover:from-emerald-100 hover:to-emerald-150' },
                ]
                const colorScheme = colorSchemes[index % colorSchemes.length]
                
                return (
                  <Card 
                    key={section.id}
                    className={`border ${colorScheme.border} hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden`}
                    onClick={() => handleSectionSelect(section.id)}
                  >
                    <CardHeader className={`${colorScheme.bg} ${colorScheme.hover} transition-all duration-200 border-b ${colorScheme.border}`}>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${colorScheme.icon} rounded-lg`}>
                            <FileText className={`w-5 h-5 ${colorScheme.iconText}`} />
                          </div>
                          <span className="text-gray-800 font-semibold">{section.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={colorScheme.badge}>{section.questionCount || section.questions.length} questions</Badge>
                          <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:${colorScheme.iconText} transition-colors`} />
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          /* Question Practice */
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedSection(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sections</span>
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedSectionData?.title}
                </h2>
                <p className="text-sm text-gray-600">
                  Mathematics Question {currentQuestion + 1} of {sectionQuestions.length}
                </p>
              </div>
            </div>

            {loadingSection ? (
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Loading questions...</p>
                </div>
              </div>
            ) : sectionQuestions.length > 0 ? (
              <Card className="max-w-4xl bg-white border border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-900">
                      Mathematics Question {currentQuestion + 1}
                    </CardTitle>
                    <Badge className={getDifficultyColor(sectionQuestions[currentQuestion]?.difficulty || 'medium')}>
                      {sectionQuestions[currentQuestion]?.difficulty || 'medium'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-8 bg-white">
                  <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                    {sectionQuestions[currentQuestion]?.text}
                  </div>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </Button>
                    
                    <Button 
                      onClick={() => setCurrentQuestion(Math.min(sectionQuestions.length - 1, currentQuestion + 1))}
                      disabled={currentQuestion === sectionQuestions.length - 1}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No questions available for this section.</p>
              </div>
            )}
          </div>
        )}

        {/* Chatbot - only show when viewing a question */}
        {selectedSection && selectedSectionData && (
          <QuestionChatbot
            currentQuestion={sectionQuestions[currentQuestion]?.text || ''}
            chapterTitle={selectedChapterData?.title || ''}
            sectionTitle={selectedSectionData?.title || ''}
            questionNumber={currentQuestion + 1}
            difficulty={sectionQuestions[currentQuestion]?.difficulty || 'medium'}
          />
        )}
      </div>
    </AppLayout>
  )
} 