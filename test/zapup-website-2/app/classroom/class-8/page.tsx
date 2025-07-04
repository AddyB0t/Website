"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Calculator,
  Globe,
  Atom,
  Languages,
  ChevronRight,
  Bell,
  Calendar,
  BookMarked,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/AppLayout"

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
      <Card className="h-full hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
        <CardContent className="p-6">
          <div className={`mb-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl w-fit border border-blue-100`}>
            <div className="text-blue-600">
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-900">{title}</h3>
          <p className="text-gray-700 text-sm font-medium flex-grow">{description}</p>
          <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
            <span>Explore</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function Class8Classroom() {
  const subjects = {
    english: {
      icon: <Languages className="w-6 h-6" />,
      title: "English",
      description: "Advanced literature analysis, creative writing, and communication skills for Class 8 students.",
      color: "border-red-500",
      href: "/classroom/english",
      topics: ["The Best Christmas Present in the World", "The Tsunami", "Glimpses of the Past", "Bepin Choudhury's Lapse of Memory", "The Summit Within", "This is Jody's Fawn", "A Visit to Cambridge", "A Short Monsoon Diary", "The Great Stone Face-I", "The Great Stone Face-II"]
    },
    hindi: {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Hindi",
      description: "Advanced Hindi literature, poetry analysis, and creative expression for Class 8 students.",
      color: "border-orange-500",
      href: "/classroom/hindi",
      topics: ["ध्वनि", "लाख की चूड़ियाँ", "बस की यात्रा", "दीवानों की हस्ती", "चिट्ठियों की अनूठी दुनिया", "भगवान के डाकिए", "क्या निराश हुआ जाए", "यह सबसे कठिन समय नहीं", "कबीर की साखियाँ", "कामचोर", "जब सिनेमा ने बोलना सीखा", "सुदामा चरित"]
    },
    mathematics: {
      icon: <Calculator className="w-6 h-6" />,
      title: "Mathematics",
      description: "Complex mathematical concepts including linear equations, quadrilaterals, and data handling for Class 8.",
      color: "border-blue-500",
      href: "/classroom/mathematics",
      topics: ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions"]
    },
    science: {
      icon: <Atom className="w-6 h-6" />,
      title: "Science",
      description: "Advanced scientific concepts in physics, chemistry, and biology tailored for Class 8 curriculum.",
      color: "border-green-500",
      href: "/classroom/science",
      topics: ["Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics", "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell - Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Force and Pressure", "Friction"]
    },
    "social-science": {
      icon: <Globe className="w-6 h-6" />,
      title: "Social Science",
      description: "Modern Indian history, world geography, and constitutional studies for Class 8 students.",
      color: "border-purple-500",
      href: "/classroom/social-studies",
      topics: ["How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age", "When People Rebel", "Weavers, Iron Smelters and Factory Owners", "Civilising the 'Native', Educating the Nation", "Women, Caste and Reform", "The Making of the National Movement", "India After Independence"]
    }
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Class 8 Classroom</h1>
          <p className="text-gray-600">Advance your knowledge with comprehensive content designed for Class 8 students across all subjects.</p>
        </div>

        <Tabs defaultValue="english" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="english" className="font-semibold">English</TabsTrigger>
            <TabsTrigger value="hindi" className="font-semibold">Hindi</TabsTrigger>
            <TabsTrigger value="mathematics" className="font-semibold">Mathematics</TabsTrigger>
            <TabsTrigger value="science" className="font-semibold">Science</TabsTrigger>
            <TabsTrigger value="social-science" className="font-semibold">Social Science</TabsTrigger>
          </TabsList>

          {Object.entries(subjects).map(([key, subject]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Topics Card */}
                <Card className="bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <CardTitle className="flex items-center space-x-2 text-gray-800">
                      {subject.icon}
                      <span>{subject.title} Topics</span>
                    </CardTitle>
                    <CardDescription>
                      Key topics and chapters covered in Class 8 {subject.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {subject.topics.map((topic, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                          <span className="text-blue-600 font-bold text-sm">{index + 1}.</span>
                          <span className="text-gray-800 font-medium text-sm">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  )
} 