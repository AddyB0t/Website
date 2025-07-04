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
  Award,
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

export default function Class12Classroom() {
  const router = useRouter()
  const [studentName, setStudentName] = useState("Student")
  const [userClass, setUserClass] = useState("12")
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
        setUserClass(parsedData.class || "12")
        
        // Redirect if user is not in class 12
        if (parsedData.class && parsedData.class !== "12") {
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
      description: "Advanced calculus, coordinate geometry, and probability with board exam and competitive exam preparation.",
      color: "border-blue-500",
      href: "/classroom/mathematics",
    },
    {
      icon: <Atom className="w-6 h-6" />,
      title: "Physics",
      description: "Electromagnetism, optics, and modern physics with comprehensive theory and practice for board and competitive exams.",
      color: "border-cyan-500",
      href: "/classroom/science/physics",
    },
    {
      icon: <BookOpenCheck className="w-6 h-6" />,
      title: "Chemistry",
      description: "Advanced organic, inorganic, and physical chemistry with detailed preparation for board and competitive exams.",
      color: "border-green-500",
      href: "/classroom/science/chemistry",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Biology",
      description: "Genetics, evolution, and human physiology with in-depth NEET/medical entrance preparation.",
      color: "border-emerald-500",
      href: "/classroom/science/biology",
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: "English",
      description: "Literature, writing skills, and communication focused on Class 12 board examination patterns.",
      color: "border-purple-500",
      href: "/classroom/english",
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Computer Science",
      description: "Advanced programming, data structures, and computer science theory aligned with board examination syllabus.",
      color: "border-indigo-500",
      href: "/classroom/computer",
    },
  ]

  const commerceSubjects = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Business Studies",
      description: "Advanced business management, finance, and marketing with case studies for Class 12 board examinations.",
      color: "border-amber-500",
      href: "/classroom/commerce/business-studies",
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Accountancy",
      description: "Partnership accounts, company accounts, and financial statements analysis with comprehensive practice.",
      color: "border-blue-500",
      href: "/classroom/commerce/accountancy",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Economics",
      description: "Advanced micro and macroeconomics with Indian economic development and current economic issues.",
      color: "border-green-500",
      href: "/classroom/commerce/economics",
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Mathematics",
      description: "Applied mathematics for commerce students covering calculus, statistics, and linear programming.",
      color: "border-purple-500",
      href: "/classroom/mathematics",
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: "English",
      description: "Literature, writing skills, and communication focused on Class 12 board examination patterns.",
      color: "border-red-500",
      href: "/classroom/english",
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Computer Applications",
      description: "Advanced database management, business applications, and web technologies for commerce students.",
      color: "border-indigo-500",
      href: "/classroom/computer",
    },
  ]

  const humanitiesSubjects = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "History",
      description: "Modern India and world history with source analysis and historiography for Class 12 board examinations.",
      color: "border-orange-500",
      href: "/classroom/humanities/history",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Political Science",
      description: "Contemporary world politics, Indian politics, and political theories with current affairs integration.",
      color: "border-red-500",
      href: "/classroom/humanities/political-science",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Geography",
      description: "Human geography, Indian geography, and practical geography with map-based questions preparation.",
      color: "border-green-500",
      href: "/classroom/humanities/geography",
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: "Languages",
      description: "Advanced literature and language studies with comprehensive grammar and writing skills development.",
      color: "border-purple-500",
      href: "/classroom/english",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Psychology",
      description: "Advanced cognitive processes, human development, and psychological disorders with practical applications.",
      color: "border-pink-500",
      href: "/classroom/humanities/psychology",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Sociology",
      description: "Advanced social institutions, social change, and research methodology with contemporary societal issues.",
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

  // Entrance exam cards based on stream
  const entranceExams = {
    science: [
      {
        title: "JEE Main & Advanced",
        description: "Engineering entrance preparation with topic-wise tests and full-length mock exams.",
        icon: <GraduationCap className="w-6 h-6" />,
        link: "/classroom/entrance-exams/jee"
      },
      {
        title: "NEET",
        description: "Medical entrance exam preparation with subject-wise test series and study material.",
        icon: <GraduationCap className="w-6 h-6" />,
        link: "/classroom/entrance-exams/neet"
      }
    ],
    commerce: [
      {
        title: "CA Foundation",
        description: "Chartered Accountancy foundation preparation with concept-based practice and test series.",
        icon: <Award className="w-6 h-6" />,
        link: "/classroom/entrance-exams/ca"
      },
      {
        title: "CUET",
        description: "Common University Entrance Test preparation for admission to central universities.",
        icon: <GraduationCap className="w-6 h-6" />,
        link: "/classroom/entrance-exams/cuet"
      }
    ],
    humanities: [
      {
        title: "CUET",
        description: "Common University Entrance Test preparation for admission to central universities.",
        icon: <GraduationCap className="w-6 h-6" />,
        link: "/classroom/entrance-exams/cuet"
      },
      {
        title: "CLAT",
        description: "Common Law Admission Test preparation for aspiring law students.",
        icon: <Award className="w-6 h-6" />,
        link: "/classroom/entrance-exams/clat"
      }
    ]
  }

  const currentExams = selectedStream === "science" ? entranceExams.science : 
                       selectedStream === "commerce" ? entranceExams.commerce : 
                       entranceExams.humanities

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
              Welcome to Your Class 12 Classroom!
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Your Board Examination year is here! Access comprehensive learning resources and
              entrance exam preparation materials tailored to your stream.
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

          <div className="mb-12 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h2 className="text-xl font-medium text-indigo-800 mb-4">Board Examination Preparation Center</h2>
            <p className="text-indigo-700 mb-6">Get comprehensive preparation materials for your Class 12 Board Examinations with sample papers, revision notes, and practice tests.</p>
            
            <div className="flex flex-wrap gap-3">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Sample Papers
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Previous Year Papers
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Revision Notes
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Mock Tests
              </Button>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
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

          <div className="mb-12">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Entrance Exam Preparation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentExams.map((exam, index) => (
                <Link key={index} href={exam.link} className="block group">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-purple-500 h-full flex">
                    <div className="mr-4 mt-1">
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        {exam.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-gray-900">{exam.title}</h3>
                      <p className="text-gray-600 text-sm">{exam.description}</p>
                      <div className="mt-3 flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
                        <span>Start Preparation</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Career Guidance</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-gray-500">•</div>
                  <span>College and University Application Guide</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-gray-500">•</div>
                  <span>Stream-specific Career Pathways</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-gray-500">•</div>
                  <span>Scholarship Opportunities</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-gray-500">•</div>
                  <span>Career Counseling Sessions</span>
                </li>
              </ul>
              <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                Explore Career Options
              </Button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Study Schedule</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-gray-500">•</div>
                  <span>Personalized Study Planner for Board Exams</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-gray-500">•</div>
                  <span>Weekly Mock Test Series</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-gray-500">•</div>
                  <span>Entrance Exam Preparation Timeline</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-gray-500">•</div>
                  <span>Daily Practice Problem Sets</span>
                </li>
              </ul>
              <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                Create Study Plan
              </Button>
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