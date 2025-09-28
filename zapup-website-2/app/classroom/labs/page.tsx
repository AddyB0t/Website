"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Microscope, FlaskConical, Zap, ChevronRight } from "lucide-react"
import Link from "next/link"

interface LabSubject {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  bgColor: string
  href: string
  experiments: string[]
}

interface LabCardProps {
  subject: string
  data: LabSubject
}

const labSubjects: { [key: string]: LabSubject } = {
  biology: {
    icon: <Microscope className="w-8 h-8" />,
    title: "Biology Labs",
    description: "Explore life sciences through hands-on experiments including cell studies, photosynthesis, and human body systems.",
    color: "border-emerald-500",
    bgColor: "from-emerald-50 to-green-50",
    href: "/classroom/labs/biology",
    experiments: ["Cell Structure & Function", "Photosynthesis Process", "Human Digestive System", "Plant & Animal Tissues", "Respiratory System"]
  },
  chemistry: {
    icon: <FlaskConical className="w-8 h-8" />,
    title: "Chemistry Labs", 
    description: "Discover chemical reactions and properties through practical experiments with acids, bases, metals, and organic compounds.",
    color: "border-blue-500",
    bgColor: "from-blue-50 to-cyan-50", 
    href: "/classroom/labs/chemistry",
    experiments: ["Acid-Base Reactions", "Metal Reactivity Series", "Carbon Compounds", "Chemical Equations", "Salt Preparation"]
  },
  physics: {
    icon: <Zap className="w-8 h-8" />,
    title: "Physics Labs",
    description: "Understand physical phenomena through experiments with light, electricity, magnetism, and motion principles.",
    color: "border-purple-500", 
    bgColor: "from-purple-50 to-indigo-50",
    href: "/classroom/labs/physics", 
    experiments: ["Light Reflection & Refraction", "Electric Circuits", "Magnetic Effects", "Ohm's Law", "Energy Conservation"]
  }
}

function LabCard({ subject, data }: LabCardProps) {
  return (
    <Link href={data.href} className="block group">
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
        <CardHeader className={`bg-gradient-to-br ${data.bgColor} border-b`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 bg-white rounded-xl shadow-sm ${data.color} border-2`}>
              <div className="text-gray-700">
                {data.icon}
              </div>
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800">{data.title}</CardTitle>
              <CardDescription className="text-gray-600">
                Practical experiments and applications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 mb-4">{data.description}</p>
          
          <div className="space-y-2 mb-4">
            <h4 className="font-semibold text-gray-800 text-sm">Key Experiments:</h4>
            <div className="grid grid-cols-1 gap-1">
              {data.experiments.slice(0, 3).map((exp, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {exp}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
            <span>Start Experiments</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function LabsPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laboratory Experiments</h1>
          <p className="text-gray-600">
            Enhance your understanding through hands-on practical experiments in Biology, Chemistry, and Physics. 
            Each lab session includes step-by-step procedures, safety guidelines, and real-world applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(labSubjects).map(([key, subject]) => (
            <LabCard key={key} subject={key} data={subject} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}