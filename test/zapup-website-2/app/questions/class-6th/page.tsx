// zapup-website-2/app/questions/class-6th/page.tsx
// Class 6th questions page showing available questions and subjects
// Accessible from sidebar navigation under Questions -> Class 6th

'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Clock, 
  Trophy, 
  Star, 
  Play, 
  BookOpen,
  FileText,
  Atom,
  Globe,
  Languages
} from 'lucide-react'

interface Question {
  id: string
  title: string
  subject: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questions: number
  timeLimit: number
  completed: boolean
  score?: number
  rating?: number
  icon: React.ReactNode
}

const questions: Question[] = [
  {
    id: '1',
    title: 'Numbers and Basic Operations',
    subject: 'Mathematics',
    difficulty: 'Easy',
    questions: 15,
    timeLimit: 20,
    completed: true,
    score: 85,
    rating: 4.2,
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: '2',
    title: 'Parts of Plants',
    subject: 'Science',
    difficulty: 'Medium',
    questions: 12,
    timeLimit: 15,
    completed: false,
    rating: 4.5,
    icon: <Atom className="w-6 h-6" />
  },
  {
    id: '3',
    title: 'Our Country India',
    subject: 'Social Studies',
    difficulty: 'Easy',
    questions: 20,
    timeLimit: 25,
    completed: true,
    score: 92,
    rating: 4.1,
    icon: <Globe className="w-6 h-6" />
  },
  {
    id: '4',
    title: 'Grammar Basics',
    subject: 'English',
    difficulty: 'Medium',
    questions: 18,
    timeLimit: 22,
    completed: false,
    rating: 4.3,
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    id: '5',
    title: 'Fractions and Decimals',
    subject: 'Mathematics',
    difficulty: 'Hard',
    questions: 10,
    timeLimit: 30,
    completed: false,
    rating: 4.6,
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: '6',
    title: 'Hindi Vyakaran',
    subject: 'Hindi',
    difficulty: 'Easy',
    questions: 16,
    timeLimit: 18,
    completed: true,
    score: 78,
    rating: 4.0,
    icon: <Languages className="w-6 h-6" />
  }
]

export default function Class6QuestionsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('All')
  
  const subjects = ['All', ...Array.from(new Set(questions.map(q => q.subject)))]
  const filteredQuestions = selectedSubject === 'All' 
    ? questions 
    : questions.filter(q => q.subject === selectedSubject)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            Class 6th Questions
          </h1>

        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {questions.filter(q => q.completed).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(questions.filter(q => q.completed && q.score).reduce((acc, q) => acc + (q.score || 0), 0) / questions.filter(q => q.completed).length) || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {questions.filter(q => !q.completed).length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {question.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{question.title}</CardTitle>
                      <p className="text-sm text-gray-600">{question.subject}</p>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {question.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  variant={question.completed ? "outline" : "default"}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {question.completed ? 'Retake Questions' : 'Start Questions'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">Try selecting a different subject filter.</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
} 