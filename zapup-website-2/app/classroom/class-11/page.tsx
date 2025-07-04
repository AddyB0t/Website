"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Calculator,
  Globe,
  Atom,
  Languages,
  Monitor,
  PenTool,
  ChevronRight,
  Bell,
  Calendar,
  BookMarked,
  User,
  GraduationCap,
  BookOpenCheck,
  BarChart3,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyrightYear } from "@/components/CopyrightYear"

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
    <Link href={href} className="block group">
      <div
        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-t-4 ${color} h-full flex flex-col`}
      >
        <div className="mb-4">
          <div
            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
          >
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm flex-grow">{description}</p>
        <div className="mt-4 flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900">
          <span>Explore</span>
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

// Stream selection card component
interface StreamCardProps {
  icon: React.ReactNode
  title: string
  subjects: string[]
  color: string
  active: boolean
  onClick: () => void
}

function StreamCard({ icon, title, subjects, color, active, onClick }: StreamCardProps) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color} h-full flex flex-col cursor-pointer transition-all ${active ? 'ring-2 ring-offset-2 ring-gray-400' : 'hover:shadow-md'}`}
      onClick={onClick}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        </div>
        {active && (
          <Badge className="bg-gray-700 text-white">Selected</Badge>
        )}
      </div>
      <div className="text-sm text-gray-600 mt-2">
        <p className="mb-2 font-medium">Core Subjects:</p>
        <ul className="space-y-1 pl-2">
          {subjects.map((subject, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{subject}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Class11Classroom() {
  const router = useRouter()
  const [studentName, setStudentName] = useState("Student")
  const [userClass, setUserClass] = useState("11")
  const [selectedStream, setSelectedStream] = useState("science")

  useEffect(() => {
    // Check if the user belongs to this class, redirect if not
    try {
      const userData = localStorage.getItem("zapup_user_data") || localStorage.getItem("zapup_signup_data")
      if (userData) {
        const parsedData = JSON.parse(userData)
        
        // Set student name if available
        if (parsedData.firstName) {
          setStudentName(`${parsedData.firstName} ${parsedData.lastName || ""}`.trim())
        }
        
        // Store class for comparison
        setUserClass(parsedData.class || "11")
        
        // Redirect if user is not in class 11
        if (parsedData.class && parsedData.class !== "11") {
          router.push(`/classroom/class-${parsedData.class}`)
        }

        // Set stream if available
        if (parsedData.stream) {
          setSelectedStream(parsedData.stream)
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }
  }, [router])

  // Stream-specific subjects
  const scienceSubjects = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Mathematics",
      description: "Higher level calculus, algebra, and trigonometry with advanced problem-solving for Class 11 science stream.",
      color: "border-blue-500",
      href: "/classroom/mathematics",
    },
    {
      icon: <Atom className="w-6 h-6" />,
      title: "Physics",
      description: "Mechanics, thermodynamics, and wave motion with comprehensive theory and numerical problems.",
      color: "border-cyan-500",
      href: "/classroom/science/physics",
    },
    {
      icon: <BookOpenCheck className="w-6 h-6" />,
      title: "Chemistry",
      description: "Organic, inorganic, and physical chemistry with detailed molecular structures and reactions.",
      color: "border-green-500",
      href: "/classroom/science/chemistry",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Biology",
      description: "Cell biology, plant physiology, and human anatomy with detailed diagrams and explanations.",
      color: "border-emerald-500",
      href: "/classroom/science/biology",
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: "English",
      description: "Advanced literature analysis and language proficiency suitable for Class 11 students.",
      color: "border-purple-500",
      href: "/classroom/english",
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Computer Science",
      description: "Programming concepts, algorithms, and data structures aligned with Class 11 CS curriculum.",
      color: "border-indigo-500",
      href: "/classroom/computer",
    },
  ]

  const commerceSubjects = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Business Studies",
      description: "Foundational business concepts, organizational structures, and management principles.",
      color: "border-amber-500",
      href: "/classroom/commerce/business-studies",
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Accountancy",
      description: "Financial accounting principles, journal entries, and statement preparation.",
      color: "border-blue-500",
      href: "/classroom/commerce/accountancy",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Economics",
      description: "Microeconomics, macroeconomics, and Indian economic development with case studies.",
      color: "border-green-500",
      href: "/classroom/commerce/economics",
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Mathematics",
      description: "Applied mathematics with focus on statistics, financial mathematics, and calculus.",
      color: "border-purple-500",
      href: "/classroom/mathematics",
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: "English",
      description: "Advanced literature analysis and language proficiency suitable for Class 11 students.",
      color: "border-red-500",
      href: "/classroom/english",
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Computer Applications",
      description: "Database management, spreadsheets, and business applications for commerce students.",
      color: "border-indigo-500",
      href: "/classroom/computer",
    },
  ]

  const humanitiesSubjects = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "History",
      description: "Ancient, medieval, and modern world history with source-based analysis and interpretation.",
      color: "border-orange-500",
      href: "/classroom/humanities/history",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Political Science",
      description: "Political theory, Indian constitution, and comparative politics with contemporary case studies.",
      color: "border-red-500",
      href: "/classroom/humanities/political-science",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Geography",
      description: "Physical, human, and economic geography with map skills and environmental studies.",
      color: "border-green-500",
      href: "/classroom/humanities/geography",
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: "Languages",
      description: "Advanced study of English and second language options with literature and communication.",
      color: "border-purple-500",
      href: "/classroom/english",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Psychology",
      description: "Introduction to human behavior, cognition, and psychological disorders with case studies.",
      color: "border-pink-500",
      href: "/classroom/humanities/psychology",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Sociology",
      description: "Study of society, social institutions, and human relationships with field research methods.",
      color: "border-blue-500",
      href: "/classroom/humanities/sociology",
    },
  ]

  // Get subjects based on selected stream
  const subjects = 
    selectedStream === "science" ? scienceSubjects : 
    selectedStream === "commerce" ? commerceSubjects : 
    humanitiesSubjects

  // Streams information
  const streams = [
    {
      icon: <Atom className="w-5 h-5" />,
      title: "Science Stream",
      subjects: ["Physics", "Chemistry", "Biology/Mathematics", "English"],
      color: "border-emerald-500",
      id: "science"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Commerce Stream",
      subjects: ["Business Studies", "Accountancy", "Economics", "English"],
      color: "border-amber-500",
      id: "commerce"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Humanities Stream",
      subjects: ["History", "Political Science", "Geography", "Psychology/Sociology"],
      color: "border-indigo-500",
      id: "humanities"
    }
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

        <div className="flex items-center space-x-6">
          <button className="relative text-gray-600 hover:text-gray-900">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </button>

          <button className="relative text-gray-600 hover:text-gray-900">
            <Calendar className="w-5 h-5" />
          </button>

          <button className="relative text-gray-600 hover:text-gray-900">
            <BookMarked className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:inline-block">{studentName}</span>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-3">
              Welcome to Your Class 11 Classroom!
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Class 11 marks a significant transition to specialized streams. Select your academic stream 
              to see subjects tailored to your chosen path.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Select Your Academic Stream</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {streams.map((stream) => (
                <StreamCard 
                  key={stream.id}
                  icon={stream.icon}
                  title={stream.title}
                  subjects={stream.subjects}
                  color={stream.color}
                  active={selectedStream === stream.id}
                  onClick={() => setSelectedStream(stream.id)}
                />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              {selectedStream === "science" ? "Science Stream Subjects" : 
               selectedStream === "commerce" ? "Commerce Stream Subjects" : 
               "Humanities Stream Subjects"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Class 11 Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Academic Guidance</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-gray-500">•</div>
                    <span>Competitive Exam Preparation Resources</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-gray-500">•</div>
                    <span>Stream-specific Career Guidance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-gray-500">•</div>
                    <span>Academic Project Ideas and Guides</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Recommended Materials</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-gray-500">•</div>
                    <span>NCERT Textbooks for Class 11</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-gray-500">•</div>
                    <span>Reference Books for Advanced Concepts</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-gray-500">•</div>
                    <span>Practice Materials for Competitive Exams</span>
                  </li>
                </ul>
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