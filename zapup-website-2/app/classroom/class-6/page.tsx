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

export default function Class6Classroom() {
  const subjects = {
    mathematics: {
      icon: <Calculator className="w-6 h-6" />,
      title: "Mathematics",
      description: "Numbers, algebra, geometry, and more with interactive lessons tailored for Class 6 students.",
      color: "border-blue-500",
      href: "/classroom/mathematics",
      topics: ["Number System", "Whole Numbers", "Playing with Numbers", "Basic Geometrical Ideas", "Understanding Elementary Shapes", "Integers", "Fractions", "Decimals", "Data Handling", "Mensuration", "Algebra", "Ratio and Proportion"]
    },
    science: {
      icon: <Atom className="w-6 h-6" />,
      title: "Science",
      description: "Introduction to physics, chemistry, and biology concepts suitable for Class 6 curriculum.",
      color: "border-green-500",
      href: "/classroom/science",
      topics: ["Food: Where Does it Come From?", "Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Body Movements", "The Living Organisms and Their Surroundings", "Motion and Measurement of Distances", "Light, Shadows and Reflections", "Electricity and Circuits"]
    },
    "social-science": {
      icon: <Globe className="w-6 h-6" />,
      title: "Social Science",
      description: "Explore history, geography, and civics topics from the Class 6 syllabus.",
      color: "border-purple-500",
      href: "/classroom/social-studies",
      topics: ["What, Where, How and When?", "From Hunting-Gathering to Growing Food", "In the Earliest Cities", "What Books and Burials Tell Us", "Kingdoms, Kings and an Early Republic", "New Questions and Ideas", "Ashoka, The Emperor Who Gave Up War", "Vital Villages, Thriving Towns", "Traders, Kings and Pilgrims", "New Empires and Kingdoms"]
    },
    english: {
      icon: <Languages className="w-6 h-6" />,
      title: "English",
      description: "Reading, writing, and communication skills through Class 6 literature and language exercises.",
      color: "border-red-500",
      href: "/classroom/english",
      topics: ["A Tale of Two Birds", "The Friendly Mongoose", "The Shepherd's Treasure", "The Old-Clock Shop", "Tansen", "The Monkey and the Crocodile", "The Wonder Called Sleep", "A Pact with the Sun", "What Happened to the Reptiles", "A Strange Wrestling Match"]
    },
    hindi: {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Hindi",
      description: "Develop Hindi language skills through stories and activities designed for Class 6.",
      color: "border-orange-500",
      href: "/classroom/hindi",
      topics: ["वह चिड़िया जो", "बचपन", "नादान दोस्त", "चाँद से थोड़ी सी गप्पें", "अक्षरों का महत्व", "पार नज़र के", "साथी हाथ बढ़ाना", "ऐसे-ऐसे", "टिकट अलबम", "झांसी की रानी", "जो वीर रस गाते हैं", "संसार पुस्तक है"]
    }
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Class 6 Classroom</h1>
          <p className="text-gray-600">Explore your subjects and start learning with interactive content designed for Class 6 students.</p>
        </div>

        <Tabs defaultValue="mathematics" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="mathematics" className="font-semibold">Mathematics</TabsTrigger>
            <TabsTrigger value="science" className="font-semibold">Science</TabsTrigger>
            <TabsTrigger value="social-science" className="font-semibold">Social Science</TabsTrigger>
            <TabsTrigger value="english" className="font-semibold">English</TabsTrigger>
            <TabsTrigger value="hindi" className="font-semibold">Hindi</TabsTrigger>
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
                      Key topics and chapters covered in Class 6 {subject.title}
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