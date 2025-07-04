"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight, Landmark, Globe } from "lucide-react"
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

export default function SocialStudiesSubjects() {
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

  // Define Social Studies subjects
  const subjects = [
    {
      icon: <Landmark className="w-10 h-10 text-red-500" />,
      title: "History/Civics",
      description: "Learn about historical events, civilizations, political systems, and citizenship.",
      color: "border-red-500",
      href: `/classroom/social-studies/history-civics?class=${className}`,
    },
    {
      icon: <Globe className="w-10 h-10 text-blue-500" />,
      title: "Geography",
      description: "Explore physical features, climate, population, resources, and environmental challenges on Earth.",
      color: "border-blue-500",
      href: `/classroom/social-studies/geography?class=${className}`,
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
            <h1 className="text-3xl font-light text-gray-800 mb-2">Social Studies Subjects</h1>
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
                <h2 className="text-xl font-medium text-gray-800 mb-2">Social Studies Resources</h2>
                <p className="text-gray-600">
                  Discover supplementary resources to deepen your understanding of history, civics, and geography.
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
                      d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Interactive Maps</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Explore historical and geographical maps with interactive features to visualize concepts better.
                </p>
                <Link href="#" className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                  Open Maps
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
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Historical Timelines</h3>
                <p className="text-gray-600 text-sm mb-4">
                  View chronological timelines of important historical events and periods to understand their sequence.
                </p>
                <Link href="#" className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                  View Timelines
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
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Documentary Videos</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Watch educational documentaries on historical events, cultures, and geographical wonders.
                </p>
                <Link href="#" className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center">
                  Watch Videos
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