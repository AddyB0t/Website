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

export default function Class7Classroom() {
  const subjects = {
    mathematics: {
      icon: <Calculator className="w-6 h-6" />,
      title: "Mathematics",
      description: "Advanced mathematical concepts including integers, fractions, and algebraic expressions for Class 7 students.",
      color: "border-blue-500",
      href: "/classroom/mathematics",
      topics: ["Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry", "Perimeter and Area", "Algebraic Expressions"]
    },
    science: {
      icon: <Atom className="w-6 h-6" />,
      title: "Science",
      description: "Comprehensive science topics covering physics, chemistry, and biology concepts for Class 7 curriculum.",
      color: "border-green-500",
      href: "/classroom/science",
      topics: ["Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations of Animals to Climate", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants"]
    },
    "social-science": {
      icon: <Globe className="w-6 h-6" />,
      title: "Social Science",
      description: "History, geography, and civics topics exploring medieval India and world geography for Class 7.",
      color: "border-purple-500",
      href: "/classroom/social-studies",
      topics: ["Tracing Changes Through a Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Rulers and Buildings", "Towns, Traders and Craftspersons", "Tribes, Nomads and Settled Communities", "Devotional Paths to the Divine", "The Making of Regional Cultures", "Eighteenth-Century Political Formations"]
    },
    english: {
      icon: <Languages className="w-6 h-6" />,
      title: "English",
      description: "Advanced reading, writing, and literature analysis skills through Class 7 English curriculum.",
      color: "border-red-500",
      href: "/classroom/english",
      topics: ["Three Questions", "A Gift of Chappals", "Gopal and the Hilsa-Fish", "The Ashes That Made Trees Bloom", "Quality", "Expert Detectives", "The Invention of Vita-Wonk", "Fire: Friend and Foe", "A Bicycle in Good Repair", "The Story of Cricket"]
    },
    hindi: {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Hindi",
      description: "Enhanced Hindi language skills through advanced stories and poetry designed for Class 7.",
      color: "border-orange-500",
      href: "/classroom/hindi",
      topics: ["हम पंछी उन्मुक्त गगन के", "दादी माँ", "हिमालय की बेटियाँ", "कठपुतली", "मिठाईवाला", "रक्त और हमारा शरीर", "पापा खो गए", "शाम-एक किसान", "चिड़िया की बच्ची", "अपूर्व अनुभव", "रहीम के दोहे", "कंचा"]
    }
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Class 7 Classroom</h1>
          <p className="text-gray-600">Explore your subjects and continue your learning journey with advanced content designed for Class 7 students.</p>
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
                      Key topics and chapters covered in Class 7 {subject.title}
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