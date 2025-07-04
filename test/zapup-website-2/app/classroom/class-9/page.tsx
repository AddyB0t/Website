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

export default function Class9Classroom() {
  const subjects = {
    english: {
      icon: <Languages className="w-6 h-6" />,
      title: "English",
      description: "Advanced literature, poetry analysis, and communication skills for Class 9 students.",
      color: "border-red-500",
      href: "/classroom/english",
      topics: ["The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "The Snake and the Mirror", "My Childhood", "Reach for the Top", "Kathmandu", "If I Were You", "The Road Not Taken", "Wind", "Rain on the Roof"]
    },
    hindi: {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Hindi",
      description: "Advanced Hindi literature, poetry, and creative writing for Class 9 students.",
      color: "border-orange-500",
      href: "/classroom/hindi",
      topics: ["दो बैलों की कथा", "ल्हासा की ओर", "उपभोक्तावाद की संस्कृति", "साँवले सपनों की याद", "नाना साहब की पुत्री देवी मैना को भस्म कर दिया गया", "प्रेमचंद के फटे जूते", "मेरे बचपन के दिन", "एक कुत्ता और एक मैना", "गिल्लू", "स्मृति", "कैदी और कोकिला", "ग्राम श्री"]
    },
    mathematics: {
      icon: <Calculator className="w-6 h-6" />,
      title: "Mathematics",
      description: "Advanced algebra, geometry, coordinate geometry, and statistics for Class 9.",
      color: "border-blue-500",
      href: "/classroom/mathematics",
      topics: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability"]
    },
    physics: {
      icon: <Zap className="w-6 h-6" />,
      title: "Physics",
      description: "Fundamental physics concepts including motion, forces, work, energy, and sound.",
      color: "border-cyan-500",
      href: "/classroom/science/physics",
      topics: ["Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound"]
    },
    chemistry: {
      icon: <FlaskConical className="w-6 h-6" />,
      title: "Chemistry",
      description: "Basic chemistry concepts including matter, atoms, molecules, and structure of atom.",
      color: "border-green-500",
      href: "/classroom/science/chemistry",
      topics: ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom"]
    },
    biology: {
      icon: <Microscope className="w-6 h-6" />,
      title: "Biology",
      description: "Life processes, biological diversity, and natural resources management.",
      color: "border-emerald-500",
      href: "/classroom/science/biology",
      topics: ["The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Why Do We Fall Ill", "Natural Resources"]
    },
    history: {
      icon: <Clock className="w-6 h-6" />,
      title: "History",
      description: "French Revolution, socialism, Nazism, and forest society changes.",
      color: "border-amber-500",
      href: "/classroom/social-studies/history",
      topics: ["The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler", "Forest Society and Colonialism", "Pastoralists in the Modern World"]
    },
    geography: {
      icon: <MapPin className="w-6 h-6" />,
      title: "Geography",
      description: "Physical features of India, drainage systems, climate, and natural vegetation.",
      color: "border-teal-500",
      href: "/classroom/social-studies/geography",
      topics: ["India - Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wildlife", "Population"]
    },
    economics: {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Economics",
      description: "Story of village Palampur and economic concepts for Class 9 students.",
      color: "border-yellow-500",
      href: "/classroom/social-studies/economics",
      topics: ["The Story of Village Palampur"]
    },
    "political-science": {
      icon: <Scale className="w-6 h-6" />,
      title: "Political Science",
      description: "Democracy, constitutional design, electoral politics, and working of institutions.",
      color: "border-indigo-500",
      href: "/classroom/social-studies/political-science",
      topics: ["What is Democracy? Why Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions", "Democratic Rights"]
    }
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Class 9 Classroom</h1>
          <p className="text-gray-600">Prepare for your board exams with comprehensive content designed for Class 9 students across specialized subjects.</p>
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
                      Key topics and chapters covered in Class 9 {subject.title}
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