"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight, BookOpen, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CopyrightYear } from "@/components/CopyrightYear"

// Helper function to get class name
function getClassName(classValue: string) {
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

// Subject card component
interface SubjectCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  href: string
}

function SubjectCard({ icon, title, description, color, href }: SubjectCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <Link href={href} className="block">
        <div className="relative h-48 bg-gray-100 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
            {icon}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-4 text-white">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{title}</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <div className="mt-2 flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900">
            <span>Explore</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function EnglishSubjects() {
  const router = useRouter()
  const [className, setClassName] = useState("6")
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get class from URL parameters or localStorage
    const classParam = searchParams.get("class")
    if (classParam) {
      setClassName(classParam)
    } else {
      try {
        const userData = localStorage.getItem("zapup_user_data") || localStorage.getItem("zapup_signup_data")
        if (userData) {
          const parsedData = JSON.parse(userData)
          setClassName(parsedData.class || "6")
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error)
      }
    }
  }, [searchParams])

  // Define English subjects
  const subjects = [
    {
      icon: <BookOpen className="w-10 h-10 text-orange-500" />,
      title: "English Literature",
      description: "Explore great literary works, poetry, prose, and drama from different periods and cultures.",
      color: "border-orange-500",
      href: `/classroom/english/literature?class=${className}`,
    },
    {
      icon: <ScrollText className="w-10 h-10 text-teal-500" />,
      title: "English Language",
      description: "Master grammar, vocabulary, writing skills, and effective communication in English.",
      color: "border-teal-500",
      href: `/classroom/english/language?class=${className}`,
    },
  ]

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
            onClick={() => router.push(`/classroom?class=${className}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classroom
          </Button>
        </div>
      </header>

      <main className="flex-grow py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-800 mb-2">English Subjects</h1>
            <p className="text-gray-600">Choose a subject to explore textbooks and learning materials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {subjects.map((subject, index) => (
              <SubjectCard
                key={index}
                icon={subject.icon}
                title={subject.title}
                description={subject.description}
                color={subject.color}
                href={subject.href}
              />
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-medium text-gray-800 mb-2">English Resources</h2>
                <p className="text-gray-600">
                  Explore supplementary resources to enhance your English language and literature skills.
                </p>
              </div>
              <Button className="bg-gray-400 hover:bg-gray-500 text-white">
                View Resources
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Learning Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Dictionary & Thesaurus</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Look up definitions, synonyms, and antonyms to expand your vocabulary and improve your writing.
                </p>
                <Link href="#" className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                  Open Dictionary
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Video Lessons</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Watch expert English teachers explain grammar concepts and analyze literary works.
                </p>
                <Link href="#" className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                  Watch Videos
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Essay Writing Guide</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn how to write effective essays, with step-by-step guides and example essays for reference.
                </p>
                <Link href="#" className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                  View Guide
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8 relative">
        <div className="absolute inset-0 opacity-5">
          <Image src="/subtle-grid-pattern.png" alt="Footer pattern" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 mr-2">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                  <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                  <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="text-gray-800 font-light tracking-widest uppercase text-sm">ZapUp</span>
                <p className="text-gray-400 text-xs">Learning companion for young minds</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Help Center
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Terms of Use
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6 text-center text-gray-600 text-sm">
            <p>&copy; <CopyrightYear /> ZapUp Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 