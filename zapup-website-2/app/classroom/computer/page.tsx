"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight, Code, Monitor, Server } from "lucide-react"
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

export default function ComputerStudies() {
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

  // Define Computer Studies subjects
  const subjects = [
    {
      icon: <Monitor className="w-10 h-10 text-indigo-500" />,
      title: "Computer Fundamentals",
      description: "Learn about hardware, software, operating systems, and basic computer concepts.",
      color: "border-indigo-500",
      href: `/classroom/computer/fundamentals?class=${className}`,
    },
    {
      icon: <Code className="w-10 h-10 text-cyan-500" />,
      title: "Programming",
      description: "Develop coding skills with languages like Python, HTML/CSS, and JavaScript fundamentals.",
      color: "border-cyan-500",
      href: `/classroom/computer/programming?class=${className}`,
    },
    {
      icon: <Server className="w-10 h-10 text-violet-500" />,
      title: "Applications & Tools",
      description: "Master essential applications like MS Office, graphics tools, and productivity software.",
      color: "border-violet-500",
      href: `/classroom/computer/applications?class=${className}`,
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
            <h1 className="text-3xl font-light text-gray-800 mb-2">Computer Studies / Applications</h1>
            <p className="text-gray-600">Choose a topic to explore textbooks and learning materials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                <h2 className="text-xl font-medium text-gray-800 mb-2">Computer Resources</h2>
                <p className="text-gray-600">
                  Explore supplementary resources to enhance your computer skills and knowledge.
                </p>
              </div>
              <Button className="bg-gray-400 hover:bg-gray-500 text-white">
                View Resources
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Learning Materials</h2>
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
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Watch step-by-step video guides for programming, software applications, and computer concepts.
                </p>
                <Link href="#" className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                  Watch Tutorials
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
                      d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Coding Exercises</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Practice coding with interactive exercises that help you develop programming skills.
                </p>
                <Link href="#" className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                  Start Coding
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
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Skill Certificates</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Complete assessments to earn digital certificates in programming and computer applications.
                </p>
                <Link href="#" className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                  View Certificates
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