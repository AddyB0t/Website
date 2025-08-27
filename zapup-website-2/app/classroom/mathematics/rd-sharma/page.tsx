"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { CopyrightYear } from "@/components/CopyrightYear"

// Sample data for demonstration
// In a real app, this would come from your API
const sampleChapters = {
  "6": [
    { id: 1, title: "Arithmetic", exercises: ["Ex. 1.1", "Ex. 1.2", "Ex. 1.3"] },
    { id: 2, title: "Fractions", exercises: ["Ex. 2.1", "Ex. 2.2"] },
    { id: 3, title: "Decimals", exercises: ["Ex. 3.1", "Ex. 3.2", "Ex. 3.3"] },
  ],
  "7": [
    { id: 1, title: "Integers", exercises: ["Ex. 1.1", "Ex. 1.2"] },
    { id: 2, title: "Rational Numbers", exercises: ["Ex. 2.1", "Ex. 2.2", "Ex. 2.3"] },
    { id: 3, title: "Data Handling", exercises: ["Ex. 3.1", "Ex. 3.2"] },
  ],
  // Add more classes as needed
};

// Sample questions data
const sampleQuestions = {
  "Ex. 1.1": [
    { id: 1, text: "Express each of the following as a product of prime factors: (i) 729 (ii) 1331 (iii) 4096" },
    { id: 2, text: "Find the HCF of: (i) 124, 144 and 156 (ii) 312, 468 and 780" },
    { id: 3, text: "Find the LCM of: (i) 84, 90 and 120 (ii) 72, 108 and 126" },
  ],
  "Ex. 1.2": [
    { id: 1, text: "Find the least number which when divided by 12, 15, 20 and 54 leaves the same remainder 8 in each case." },
    { id: 2, text: "Find the largest number that divides 2053 and 967 leaving remainders 7 and 5 respectively." },
  ],
  // Add more exercises as needed
};

export default function RDSharmaMathematics() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [className, setClassName] = useState("6")
  const [chapters, setChapters] = useState<any[]>([])
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)

  useEffect(() => {
    // Get class from URL parameters
    const classParam = searchParams.get("class")
    if (classParam) {
      setClassName(classParam)
      // In a real app, you would fetch chapters for this class from an API
      setChapters(sampleChapters[classParam as keyof typeof sampleChapters] || [])
    }
  }, [searchParams])

  const handleExerciseSelect = (exercise: string) => {
    setSelectedExercise(exercise)
    setQuestions(sampleQuestions[exercise as keyof typeof sampleQuestions] || [])
    setSelectedQuestion(null)
    setAnswer(null)
  }

  const handleQuestionSelect = async (questionId: number, questionText: string) => {
    setSelectedQuestion(questionId)
    setAnswer(null)
    setIsLoadingAnswer(true)

    try {
      // Call your API to generate an answer
      const response = await fetch("/api/generate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questionText,
          book: `R.D. Sharma Mathematics Class ${className}`,
          chapter: chapters.find(ch => ch.id === selectedChapter)?.title || "",
          exercise: selectedExercise,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnswer(data.answer)
      } else {
        setAnswer("Sorry, we couldn't generate an answer at this time. Please try again later.")
      }
    } catch (error) {
      console.error("Error generating answer:", error)
      setAnswer("An error occurred while generating the answer. Please try again.")
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
            <h1 className="text-3xl font-light text-gray-800 mb-2">R.D. Sharma Mathematics {getClassName(className)}</h1>
            <p className="text-gray-600">Select a chapter and exercise to view questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-xl font-medium text-gray-800 mb-4">Chapters</h2>
                <Accordion type="single" collapsible className="w-full">
                  {chapters.map((chapter) => (
                    <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                      <AccordionTrigger 
                        className="text-left font-medium"
                        onClick={() => setSelectedChapter(chapter.id)}
                      >
                        Chapter {chapter.id}: {chapter.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {chapter.exercises.map((exercise: string) => (
                            <Button
                              key={exercise}
                              variant="ghost"
                              size="sm"
                              className={`w-full justify-start ${
                                selectedExercise === exercise ? "bg-blue-50 text-blue-600" : ""
                              }`}
                              onClick={() => handleExerciseSelect(exercise)}
                            >
                              {exercise}
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <div className="md:col-span-2">
              {selectedExercise ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-medium text-gray-800 mb-4">
                      {selectedExercise} Questions
                    </h2>
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <Card 
                          key={question.id} 
                          className={`cursor-pointer transition-all ${
                            selectedQuestion === question.id 
                              ? "border-blue-400 ring-1 ring-blue-400" 
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => handleQuestionSelect(question.id, question.text)}
                        >
                          <CardContent className="p-4">
                            <p className="font-medium">
                              Question {question.id}: <span className="font-normal">{question.text}</span>
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {selectedQuestion && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h2 className="text-xl font-medium text-gray-800 mb-4">Answer</h2>
                      {isLoadingAnswer ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                          <span className="ml-3 text-gray-600">Generating answer...</span>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          {answer ? (
                            <div className="whitespace-pre-line">{answer}</div>
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