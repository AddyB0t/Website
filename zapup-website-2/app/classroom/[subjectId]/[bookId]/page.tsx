"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CopyrightYear } from "@/components/CopyrightYear"
import { Book, Class, Subject } from "@/lib/supabase"

export default function BookPage({ params }: { params: { subjectId: string, bookId: string } }) {
  const router = useRouter()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [book, setBook] = useState<Book | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [params.subjectId, params.bookId])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch subject info
      const subjectsResponse = await fetch(`/api/subjects`)
      
      if (!subjectsResponse.ok) {
        throw new Error(`Failed to fetch subjects: ${subjectsResponse.statusText}`)
      }
      
      const subjectsData = await subjectsResponse.json()
      const currentSubject = subjectsData.find((s: Subject) => s.id === params.subjectId)

      if (!currentSubject) {
        throw new Error(`Subject not found: ${params.subjectId}`)
      }

      setSubject(currentSubject)
      
      // Fetch books for this subject to get current book
      const booksResponse = await fetch(`/api/subjects/${params.subjectId}/books`)
      
      if (!booksResponse.ok) {
        throw new Error(`Failed to fetch books: ${booksResponse.statusText}`)
      }
      
      const booksData = await booksResponse.json()
      const currentBook = booksData.find((b: Book) => b.id === params.bookId)

      if (!currentBook) {
        throw new Error(`Book not found: ${params.bookId}`)
      }

      setBook(currentBook)
      
      // Fetch classes for this book
      const classesResponse = await fetch(`/api/books/${params.bookId}/classes`)
      
      if (!classesResponse.ok) {
        throw new Error(`Failed to fetch classes: ${classesResponse.statusText}`)
      }
      
      const classesData = await classesResponse.json()
      setClasses(classesData)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load book data. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
            onClick={() => router.push(`/classroom/${params.subjectId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Button>
        </div>
      </header>

      <main className="flex-grow py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
              <span className="text-gray-600">Loading book data...</span>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="text-gray-600 text-sm mb-1">{subject?.name}</div>
                <h1 className="text-3xl font-light text-gray-800 mb-2">{book?.title}</h1>
                <p className="text-gray-600">Select a class to view its content</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 py-2 px-4 rounded-md mb-6">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {classes.length > 0 ? (
                  classes.map((classItem) => (
                    <Card key={classItem.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <Link href={`/classroom/${params.subjectId}/${params.bookId}/${classItem.id}`}>
                        <div className="h-40 bg-blue-50 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-blue-400 opacity-80" />
                        </div>
                        <CardContent className="p-6">
                          <h2 className="text-xl font-medium text-gray-800 mb-2">{classItem.name}</h2>
                        </CardContent>
                      </Link>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No classes found</h3>
                    <p className="text-gray-600 max-w-md">
                      There are no classes available for this book at the moment. Please check back later.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
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