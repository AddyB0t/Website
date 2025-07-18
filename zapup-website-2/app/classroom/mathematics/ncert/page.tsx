"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight, BookOpen, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CopyrightYear } from "@/components/CopyrightYear"
import { Chapter, Exercise, Question } from "@/lib/supabase"

export default function NCERTMathematics() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [className, setClassName] = useState("6")
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoadingChapters, setIsLoadingChapters] = useState(true)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get class from URL parameters
    const classParam = searchParams.get("class") || "6" 
    setClassName(classParam)
    
    fetchChapters(classParam)
  }, [searchParams])

  const fetchChapters = async (classId: string) => {
    setIsLoadingChapters(true)
    try {
      const response = await fetch(`/api/classes/${classId}/chapters`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch chapters: ${response.statusText}`)
      }
      
      const chaptersData = await response.json()
      setChapters(chaptersData)
    } catch (err) {
      console.error("Error fetching chapters:", err)
      setError("Failed to load chapters. Please try again.")
    } finally {
      setIsLoadingChapters(false)
    }
  }

  const handleChapterSelect = async (chapterId: number) => {
    // Toggle chapter selection
    if (selectedChapter === chapterId) {
      setSelectedChapter(null)
      return
    }
    
    setSelectedChapter(chapterId)
    setSelectedExercise(null)
    setQuestions([])
    setSelectedQuestion(null)
    setAnswer(null)
    
    try {
      const response = await fetch(`/api/chapters/${chapterId}/exercises`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch exercises: ${response.statusText}`)
      }
      
      const exercisesData = await response.json()
      setExercises(exercisesData)
    } catch (err) {
      console.error("Error fetching exercises:", err)
      setError("Failed to load exercises. Please try again.")
    }
  }

  const handleExerciseSelect = async (exerciseId: string) => {
    setSelectedExercise(exerciseId)
    setQuestions([])
    setSelectedQuestion(null)
    setAnswer(null)
    
    try {
      const response = await fetch(`/api/exercises/${exerciseId}/questions`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.statusText}`)
      }
      
      const questionsData = await response.json()
      setQuestions(questionsData)
    } catch (err) {
      console.error("Error fetching questions:", err)
      setError("Failed to load questions. Please try again.")
    }
  }

  const handleQuestionSelect = async (questionId: number, questionText: string) => {
    setSelectedQuestion(questionId)
    setAnswer(null)
    setIsLoadingAnswer(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: questionId,
          question: questionText,
          book: `NCERT Mathematics Class ${className}`,
          chapter: chapters.find(ch => ch.id === selectedChapter)?.title || "",
          exercise: selectedExercise,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate answer: ${response.statusText}`)
      }

      const data = await response.json()
      setAnswer(data.answer)
    } catch (error) {
      console.error("Error generating answer:", error)
      setError("Failed to generate answer. Please try again.")
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  const getClassName = (classValue: string) => {
    const classMap: { [key: string]: string } = {
      "6": "Class 6",
      "7": "Class 7",
      "8": "Class 8",
      "9": "Class 9",
      "10": "Class 10",
      "11": "Class 11",
      "12": "Class 12",
    }
    return classMap[classValue] || `Class ${classValue}`
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-gray-800 font-light tracking-widest uppercase text-lg">ZapUp</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600"
            onClick={() => router.push(`/classroom/mathematics?class=${className}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Button>
        </div>
      </header>

      <main className="flex-grow py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-800 mb-2">NCERT Mathematics {getClassName(className)}</h1>
            <p className="text-gray-600">Select a chapter and exercise to view questions</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 py-2 px-4 rounded-md mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Chapters</h2>
                
                {isLoadingChapters ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="ml-3 text-gray-600">Loading chapters...</span>
                  </div>
                ) : chapters.length > 0 ? (
                  <div className="space-y-2">
                    {chapters.map((chapter) => (
                      <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-blue-50 
                                     border-b border-gray-200 font-semibold text-gray-900 
                                     hover:text-blue-700 transition-colors flex justify-between items-center"
                          onClick={() => handleChapterSelect(chapter.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-sm font-bold">
                              {chapter.id}
                            </div>
                            <span>{chapter.title}</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 transform transition-transform 
                                                    ${selectedChapter === chapter.id ? 'rotate-90' : ''}`} />
                        </button>
                        
                        {selectedChapter === chapter.id && (
                          <div className="px-4 py-2 bg-white border-t border-gray-100">
                            {exercises.length > 0 ? (
                              exercises.map((exercise) => (
                                <button
                                  key={exercise.id}
                                  className={`w-full text-left px-3 py-2 my-1 rounded-md text-sm flex items-center
                                             ${selectedExercise === exercise.id 
                                               ? "bg-blue-100 text-blue-700 font-medium" 
                                               : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"}`}
                                  onClick={() => handleExerciseSelect(exercise.id)}
                                >
                                  <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                                  {exercise.title}
                                </button>
                              ))
                            ) : (
                              <p className="text-gray-500 italic text-sm px-3 py-2">No exercises found</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No chapters found</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              {selectedExercise ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-medium text-blue-700 flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 text-blue-700">
                        <FileText size={16} />
                      </div>
                      {selectedExercise} Questions
                    </h2>
                    {questions.length > 0 ? (
                      <div className="space-y-4">
                        {questions.map((question) => (
                          <div 
                            key={question.id} 
                            className={`cursor-pointer transition-colors rounded-lg p-4 border ${
                              selectedQuestion === question.id 
                                ? "border-blue-400 bg-blue-50" 
                                : "border-gray-200 bg-white hover:bg-gray-50"
                            }`}
                            onClick={() => handleQuestionSelect(question.id, question.text)}
                          >
                            <div className="flex items-start">
                              <div className="mr-3 bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full text-sm">
                                Q{question.order_index || question.id}
                              </div>
                              <div className={`flex-1 ${selectedQuestion === question.id ? "text-blue-700" : "text-gray-800"}`}>
                                {question.text}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No questions found for this exercise</p>
                    )}
                  </div>

                  {selectedQuestion && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h2 className="text-xl font-medium text-blue-700 mb-4 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 mr-2 flex items-center justify-center text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        Answer
                      </h2>
                      {isLoadingAnswer ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                          <span className="ml-3 text-gray-600">Generating answer...</span>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          {answer ? (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-800 whitespace-pre-line break-words max-w-full overflow-hidden">
                              {answer}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Select a question to see its answer</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Select an Exercise</h3>
                  <p className="text-gray-600 max-w-md">
                    Choose a chapter and exercise from the list on the left to view questions and get answers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 md:px-12">
          <div className="border-t border-gray-200 mt-6 pt-6 text-center text-gray-600 text-sm">
            <p>&copy; <CopyrightYear /> ZapUp Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 