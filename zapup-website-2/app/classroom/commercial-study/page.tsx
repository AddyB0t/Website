"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Target, ChevronRight, Clock, Building, DollarSign, Users, BarChart } from "lucide-react"
import Link from "next/link"

interface CommercialTopic {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  concepts: string[]
  realWorldApplications: string[]
  questions: number
  objectives: string[]
}

const commercialTopics: CommercialTopic[] = [
  {
    id: "business-basics",
    title: "Business Fundamentals",
    description: "Introduction to business concepts, types of business organizations, and entrepreneurship basics.",
    duration: "3-4 weeks study",
    difficulty: "Easy",
    concepts: ["Business Definition", "Sole Proprietorship", "Partnership", "Companies", "Entrepreneurship"],
    realWorldApplications: ["Local business analysis", "Business plan creation", "Market research", "SWOT analysis"],
    questions: 20,
    objectives: ["Understand business types", "Identify business opportunities", "Analyze business structures"]
  },
  {
    id: "economics-principles",
    title: "Economics Principles",
    description: "Basic economic concepts including demand, supply, market forces, and economic systems.",
    duration: "3-4 weeks study",
    difficulty: "Medium",
    concepts: ["Demand & Supply", "Market Economy", "Inflation", "GDP", "Economic Systems"],
    realWorldApplications: ["Price analysis", "Market trends", "Economic indicators", "Consumer behavior"],
    questions: 22,
    objectives: ["Understand market dynamics", "Analyze economic trends", "Apply economic principles"]
  },
  {
    id: "banking-finance",
    title: "Banking & Finance",
    description: "Understanding banking systems, financial institutions, and personal finance management.",
    duration: "2-3 weeks study",
    difficulty: "Medium",
    concepts: ["Banking Services", "Interest Rates", "Loans", "Investments", "Financial Planning"],
    realWorldApplications: ["Bank account management", "Budget planning", "Investment analysis", "Loan calculations"],
    questions: 18,
    objectives: ["Understand banking operations", "Manage personal finances", "Make informed financial decisions"]
  },
  {
    id: "trade-commerce",
    title: "Trade & Commerce",
    description: "Study of trade practices, import-export, and commercial transactions in modern business.",
    duration: "2-3 weeks study",
    difficulty: "Medium",
    concepts: ["Domestic Trade", "International Trade", "E-commerce", "Trade Barriers", "Commercial Documents"],
    realWorldApplications: ["Trade document analysis", "E-commerce platforms", "Export-import procedures", "Trade agreements"],
    questions: 16,
    objectives: ["Understand trade mechanisms", "Analyze commercial documents", "Explore e-commerce trends"]
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship & Innovation",
    description: "Developing entrepreneurial mindset, innovation concepts, and startup fundamentals.",
    duration: "2-3 weeks study",
    difficulty: "Hard",
    concepts: ["Innovation", "Startup Process", "Risk Management", "Business Models", "Leadership"],
    realWorldApplications: ["Business idea development", "Startup case studies", "Innovation projects", "Leadership activities"],
    questions: 14,
    objectives: ["Develop entrepreneurial thinking", "Create business ideas", "Understand startup challenges"]
  },
  {
    id: "marketing-fundamentals",
    title: "Marketing Fundamentals",
    description: "Basic marketing concepts, customer understanding, and promotional strategies.",
    duration: "2 weeks study",
    difficulty: "Easy",
    concepts: ["Marketing Mix", "Customer Segmentation", "Advertising", "Branding", "Sales Process"],
    realWorldApplications: ["Advertisement analysis", "Brand study", "Customer surveys", "Marketing campaigns"],
    questions: 12,
    objectives: ["Understand marketing principles", "Analyze advertising strategies", "Create marketing plans"]
  },
  {
    id: "accounting-basics",
    title: "Accounting Basics",
    description: "Introduction to accounting principles, financial statements, and basic bookkeeping.",
    duration: "2-3 weeks study",
    difficulty: "Medium",
    concepts: ["Financial Statements", "Balance Sheet", "Profit & Loss", "Cash Flow", "Bookkeeping"],
    realWorldApplications: ["Simple bookkeeping", "Financial analysis", "Budget preparation", "Account maintenance"],
    questions: 15,
    objectives: ["Understand financial statements", "Perform basic calculations", "Analyze business performance"]
  },
  {
    id: "business-ethics",
    title: "Business Ethics & Social Responsibility",
    description: "Understanding ethical business practices, corporate social responsibility, and sustainable business.",
    duration: "1-2 weeks study",
    difficulty: "Easy",
    concepts: ["Business Ethics", "CSR", "Sustainability", "Fair Trade", "Corporate Governance"],
    realWorldApplications: ["Ethical case studies", "CSR project analysis", "Sustainability initiatives", "Fair trade examples"],
    questions: 10,
    objectives: ["Understand business ethics", "Analyze CSR initiatives", "Promote sustainable practices"]
  }
]

const studyTips = [
  "Connect theoretical concepts with real-world business examples",
  "Follow business news and current economic developments",
  "Analyze successful businesses and their strategies",
  "Practice calculations for financial and economic problems",
  "Participate in business simulation games and activities",
  "Create mock business plans for practical application",
  "Study case studies of Indian and international businesses",
  "Understand the role of technology in modern commerce"
]

function CommercialTopicCard({ topic }: { topic: CommercialTopic }) {
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
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="flex items-start justify-between mb-2">
          <Badge className={getDifficultyColor(topic.difficulty)}>
            {topic.difficulty}
          </Badge>
          <TrendingUp className="w-5 h-5 text-green-600" />
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
            <BarChart className="w-4 h-4 mr-1" />
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
                  <Target className="w-3 h-3 mr-2 mt-0.5 text-green-500" />
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
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Real-World Applications:</h4>
            <div className="space-y-1">
              {topic.realWorldApplications.slice(0, 2).map((application, index) => (
                <div key={index} className="flex items-start text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-1.5"></span>
                  {application}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link href={`/questions/10/commercial-study?topic=${topic.id}`}>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              <span>Study & Practice Questions</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CommercialStudyPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Commercial Study</h1>
              <p className="text-gray-600">Class 10 ICSE - All ICSE Schools</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Explore the dynamic world of business and commerce through comprehensive study of economics, 
            entrepreneurship, finance, and business ethics. This comprehensive ICSE curriculum 
            prepares students for modern business challenges while meeting board examination requirements.
          </p>
        </div>

        {/* Study Tips */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Building className="w-5 h-5" />
              <span>Commercial Study Strategies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studyTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-orange-800">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commercial Topics Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commercialTopics.map((topic) => (
              <CommercialTopicCard key={topic.id} topic={topic} />
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
                <Building className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Business Concepts</h4>
                <p className="text-sm text-gray-600">Theory & applications</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Economics</h4>
                <p className="text-sm text-gray-600">Principles & analysis</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Entrepreneurship</h4>
                <p className="text-sm text-gray-600">Innovation & leadership</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BarChart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Case Studies</h4>
                <p className="text-sm text-gray-600">Real-world analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}