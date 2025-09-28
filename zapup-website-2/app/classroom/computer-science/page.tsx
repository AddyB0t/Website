"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Monitor, Target, ChevronRight, Clock, Code, Database, Globe, Shield } from "lucide-react"
import Link from "next/link"

interface ComputerTopic {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  concepts: string[]
  practicalActivities: string[]
  questions: number
  objectives: string[]
}

const computerTopics: ComputerTopic[] = [
  {
    id: "programming-concepts",
    title: "Programming Concepts",
    description: "Introduction to programming logic, algorithms, flowcharts, and basic coding principles.",
    duration: "3-4 weeks study",
    difficulty: "Medium",
    concepts: ["Algorithms", "Flowcharts", "Pseudocode", "Programming Logic", "Debugging"],
    practicalActivities: ["Create flowcharts", "Write algorithms", "Debug simple programs", "Trace program execution"],
    questions: 20,
    objectives: ["Understand algorithm design", "Create logical flowcharts", "Apply debugging techniques"]
  },
  {
    id: "data-structures",
    title: "Data Structures",
    description: "Understanding arrays, stacks, queues, and basic data organization methods.",
    duration: "2-3 weeks study",
    difficulty: "Hard",
    concepts: ["Arrays", "Stacks", "Queues", "Lists", "Data Organization"],
    practicalActivities: ["Implement arrays", "Stack operations", "Queue simulations", "Data manipulation"],
    questions: 18,
    objectives: ["Implement basic data structures", "Understand data organization", "Apply appropriate data types"]
  },
  {
    id: "computer-hardware",
    title: "Computer Hardware",
    description: "Study of computer components, input/output devices, and system architecture.",
    duration: "2-3 weeks study",
    difficulty: "Easy",
    concepts: ["CPU", "Memory", "Storage Devices", "Input Devices", "Output Devices", "Motherboard"],
    practicalActivities: ["Identify components", "Hardware assembly", "Performance comparison", "Troubleshooting"],
    questions: 15,
    objectives: ["Identify computer components", "Understand system architecture", "Compare hardware specifications"]
  },
  {
    id: "software-applications",
    title: "Software Applications",
    description: "Practical use of software tools including word processing, spreadsheets, and presentations.",
    duration: "3-4 weeks study",
    difficulty: "Easy",
    concepts: ["Word Processing", "Spreadsheets", "Presentations", "Graphics Software", "Utility Programs"],
    practicalActivities: ["Create documents", "Excel calculations", "PowerPoint presentations", "Image editing"],
    questions: 12,
    objectives: ["Master office applications", "Create professional documents", "Use software efficiently"]
  },
  {
    id: "database-basics",
    title: "Database Basics",
    description: "Introduction to databases, tables, records, and basic database management concepts.",
    duration: "2-3 weeks study",
    difficulty: "Medium",
    concepts: ["Tables", "Records", "Fields", "Primary Keys", "Relationships", "Queries"],
    practicalActivities: ["Create tables", "Enter data", "Design queries", "Generate reports"],
    questions: 16,
    objectives: ["Design simple databases", "Understand data relationships", "Create basic queries"]
  },
  {
    id: "internet-web",
    title: "Internet & Web Technologies",
    description: "Understanding internet concepts, web browsing, email, and online safety practices.",
    duration: "2 weeks study",
    difficulty: "Easy",
    concepts: ["Internet Basics", "Web Browsers", "Email", "Search Engines", "Web Security"],
    practicalActivities: ["Safe browsing", "Email management", "Web research", "Online collaboration"],
    questions: 10,
    objectives: ["Navigate internet safely", "Use communication tools", "Understand web technologies"]
  },
  {
    id: "digital-ethics",
    title: "Digital Ethics & Safety",
    description: "Understanding digital citizenship, cyber safety, and ethical use of technology.",
    duration: "1-2 weeks study",
    difficulty: "Easy",
    concepts: ["Cyber Safety", "Digital Citizenship", "Privacy", "Copyright", "Online Etiquette"],
    practicalActivities: ["Safety scenarios", "Ethics discussions", "Privacy settings", "Digital footprint"],
    questions: 8,
    objectives: ["Practice digital citizenship", "Understand online safety", "Respect digital rights"]
  }
]

const studyTips = [
  "Practice programming concepts with hands-on coding exercises",
  "Create flowcharts and algorithms for everyday problems",
  "Experiment with different software applications regularly",
  "Stay updated with current technology trends and developments",
  "Work on practical projects to apply theoretical knowledge",
  "Focus on understanding concepts rather than memorizing facts",
  "Use online resources and tutorials for additional practice",
  "Participate in coding clubs or computer science competitions"
]

function ComputerTopicCard({ topic }: { topic: ComputerTopic }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-start justify-between mb-2">
          <Badge className={getDifficultyColor(topic.difficulty)}>
            {topic.difficulty}
          </Badge>
          <Monitor className="w-5 h-5 text-blue-600" />
        </div>
        <CardTitle className="text-lg text-gray-800 mb-2">{topic.title}</CardTitle>
        <CardDescription className="text-gray-600">
          {topic.description}
        </CardDescription>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {topic.duration}
          </div>
          <div className="flex items-center">
            <Code className="w-4 h-4 mr-1" />
            {topic.questions} questions
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Learning Objectives:</h4>
            <ul className="space-y-1">
              {topic.objectives.map((objective, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <Target className="w-3 h-3 mr-2 mt-0.5 text-blue-500" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Concepts:</h4>
            <div className="flex flex-wrap gap-1">
              {topic.concepts.slice(0, 4).map((concept, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {concept}
                </Badge>
              ))}
              {topic.concepts.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{topic.concepts.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Practical Activities:</h4>
            <div className="space-y-1">
              {topic.practicalActivities.slice(0, 2).map((activity, index) => (
                <div key={index} className="flex items-start text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-1.5"></span>
                  {activity}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link href={`/questions/10/computer-science?topic=${topic.id}`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <span>Study & Practice Questions</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ComputerSciencePage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Monitor className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Computer Science</h1>
              <p className="text-gray-600">Class 10 ICSE - All ICSE Schools</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Explore the fascinating world of computer science through comprehensive study of programming, 
            algorithms, hardware, software applications, and digital ethics. This comprehensive ICSE 
            curriculum prepares students for the digital age while meeting board examination requirements.
          </p>
        </div>

        {/* Study Tips */}
        <Card className="mb-8 border-cyan-200 bg-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-cyan-800">
              <Code className="w-5 h-5" />
              <span>Computer Science Study Strategies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studyTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-cyan-800">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Computer Topics Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {computerTopics.map((topic) => (
              <ComputerTopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>

        {/* Assessment Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">ICSE Assessment Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Code className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Programming</h4>
                <p className="text-sm text-gray-600">Logic & algorithms</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Database className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Data Management</h4>
                <p className="text-sm text-gray-600">Structures & databases</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Globe className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Web Technologies</h4>
                <p className="text-sm text-gray-600">Internet & applications</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Digital Ethics</h4>
                <p className="text-sm text-gray-600">Safety & citizenship</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}