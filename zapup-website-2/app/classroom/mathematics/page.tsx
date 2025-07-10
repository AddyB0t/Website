"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, HelpCircle, BookOpen, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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

// Book card component
interface BookCardProps {
  title: string
  author: string
  publisher: string
  units: number
  description: string
  progress: number
  href: string
}

function BookCard({ title, author, publisher, units, description, progress, href }: BookCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <Link href={href} className="block">
        <div className="relative h-48 bg-gray-100 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-gray-400" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-4 text-white">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{publisher}</span>
              <span className="text-sm">{units} Units</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-3">{description}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-medium text-gray-700">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Link>
    </div>
  )
}

export default function MathematicsBooks() {
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

  // Define books based on class
  const books = [
    {
      title: `Mathematics - NCERT`,
      author: "NCERT",
      publisher: "NCERT",
      units: 14,
      description: `Official NCERT textbook for ${getClassName(className)} Mathematics`,
      progress: 45,
      href: `/classroom/mathematics/ncert?class=${className}`,
    },
    {
      title: `Mathematics - R.S. Aggarwal`,
      author: "R.S. Aggarwal",
      publisher: "S. Chand Publishing",
      units: 16,
      description: "Comprehensive guide with theory and extra practice problems",
      progress: 20,
      href: `/classroom/mathematics/rs-aggarwal?class=${className}`,
    },
    {
      title: `Mathematics - R.D. Sharma`,
      author: "R.D. Sharma",
      publisher: "Dhanpat Rai Publications",
      units: 15,
      description: "Advanced problems for additional practice",
      progress: 10,
      href: `/classroom/mathematics/rd-sharma?class=${className}`,
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
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="flex-grow py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-800 mb-2">Mathematics Books</h1>
            <p className="text-gray-600">Choose a textbook to view chapters and exercises</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {books.map((book, index) => (
              <BookCard
                key={index}
                title={book.title}
                author={book.author}
                publisher={book.publisher}
                units={book.units}
                description={book.description}
                progress={book.progress}
                href={book.href}
              />
            ))}
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
