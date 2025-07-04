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
  Microscope,
  FlaskConical,
  Zap,
  MapPin,
  Clock,
  DollarSign,
  Scale,
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

export default function Class10Classroom() {
  const subjects = {
    english: {
      icon: <Languages className="w-6 h-6" />,
      title: "English",
      description: "Board exam preparation with advanced literature, poetry, and writing skills for Class 10.",
      color: "border-red-500",
      href: "/classroom/english",
      topics: ["A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Stories about Flying", "From the Diary of Anne Frank", "The Hundred Dresses-I", "The Hundred Dresses-II", "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "The Sermon at Benares", "The Proposal"]
    },
    hindi: {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Hindi",
      description: "Board exam focused Hindi literature, poetry, and advanced language skills for Class 10.",
      color: "border-orange-500",
      href: "/classroom/hindi",
      topics: ["सूरदास के पद", "तुलसीदास के पद", "देव", "जयशंकर प्रसाद", "सूर्यकांत त्रिपाठी 'निराला'", "नागार्जुन", "गिरिजाकुमार माथुर", "ऋतुराज", "मंगलेश डबराल", "स्वयं प्रकाश", "सर्वेश्वर दयाल सक्सेना", "मन्नू भंडारी"]
    },
    mathematics: {
      icon: <Calculator className="w-6 h-6" />,
      title: "Mathematics",
      description: "Board exam preparation with advanced algebra, geometry, trigonometry, and statistics.",
      color: "border-blue-500",
      href: "/classroom/mathematics",
      topics: ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"]
    },
    physics: {
      icon: <Zap className="w-6 h-6" />,
      title: "Physics",
      description: "Board exam physics including light, electricity, magnetic effects, and energy sources.",
      color: "border-cyan-500",
      href: "/classroom/science/physics",
      topics: ["Light - Reflection and Refraction", "Human Eye and Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy"]
    },
    chemistry: {
      icon: <FlaskConical className="w-6 h-6" />,
      title: "Chemistry",
      description: "Board exam chemistry covering acids, bases, metals, carbon compounds, and life processes.",
      color: "border-green-500",
      href: "/classroom/science/chemistry",
      topics: ["Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds"]
    },
    biology: {
      icon: <Microscope className="w-6 h-6" />,
      title: "Biology",
      description: "Board exam biology focusing on life processes, reproduction, and heredity.",
      color: "border-emerald-500",
      href: "/classroom/science/biology",
      topics: ["Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Our Environment", "Management of Natural Resources"]
    },
    history: {
      icon: <Clock className="w-6 h-6" />,
      title: "History",
      description: "Modern world history including nationalism, industrialization, and print culture.",
      color: "border-amber-500",
      href: "/classroom/social-studies/history",
      topics: ["The Rise of Nationalism in Europe", "The Nationalist Movement in Indo-China", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Print Culture and the Modern World"]
    },
    geography: {
      icon: <MapPin className="w-6 h-6" />,
      title: "Geography",
      description: "Resources, agriculture, water resources, and manufacturing industries in India.",
      color: "border-teal-500",
      href: "/classroom/social-studies/geography",
      topics: ["Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources", "Manufacturing Industries", "Lifelines of National Economy"]
    },
    economics: {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Economics",
      description: "Development economics, sectors of economy, money, credit, and globalization.",
      color: "border-yellow-500",
      href: "/classroom/social-studies/economics",
      topics: ["Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation and the Indian Economy", "Consumer Rights"]
    },
    "political-science": {
      icon: <Scale className="w-6 h-6" />,
      title: "Political Science",
      description: "Power sharing, federalism, democracy, political parties, and government outcomes.",
      color: "border-indigo-500",
      href: "/classroom/social-studies/political-science",
      topics: ["Power Sharing", "Federalism", "Democracy and Diversity", "Gender, Religion and Caste", "Popular Struggles and Movements", "Political Parties", "Outcomes of Democracy", "Challenges to Democracy"]
    }
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Class 10 Classroom</h1>
          <p className="text-gray-600">Master your board exams with comprehensive preparation content designed for Class 10 students across all subjects.</p>
        </div>

        <Tabs defaultValue="english" className="w-full">
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              <TabsList className="grid grid-cols-3 col-span-2 md:col-span-3">
                <TabsTrigger value="english" className="font-semibold text-xs">English</TabsTrigger>
                <TabsTrigger value="hindi" className="font-semibold text-xs">Hindi</TabsTrigger>
                <TabsTrigger value="mathematics" className="font-semibold text-xs">Mathematics</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-3 col-span-2">
                <TabsTrigger value="physics" className="font-semibold text-xs">Physics</TabsTrigger>
                <TabsTrigger value="chemistry" className="font-semibold text-xs">Chemistry</TabsTrigger>
                <TabsTrigger value="biology" className="font-semibold text-xs">Biology</TabsTrigger>
              </TabsList>
            </div>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="history" className="font-semibold text-xs">History</TabsTrigger>
              <TabsTrigger value="geography" className="font-semibold text-xs">Geography</TabsTrigger>
              <TabsTrigger value="economics" className="font-semibold text-xs">Economics</TabsTrigger>
              <TabsTrigger value="political-science" className="font-semibold text-xs">Political Science</TabsTrigger>
            </TabsList>
          </div>

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
                      Key topics and chapters covered in Class 10 {subject.title} for board exam preparation
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