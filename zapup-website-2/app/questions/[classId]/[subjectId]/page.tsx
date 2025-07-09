// zapup-website-2/app/questions/[classId]/[subjectId]/page.tsx
// Subject-specific question page with question topics and difficulty levels
// Final destination in the navigation: Questions → Class → Subject

'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Clock, Trophy, Star, ChevronRight, ArrowLeft, Play } from 'lucide-react'
import { getSubjectDisplayName } from '@/lib/subjects'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { canAccessClass } from '@/lib/access-control'

export default function SubjectQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const { preferences, isProfileComplete } = useUserPreferences()
  
  const classId = params.classId as string
  const subjectId = params.subjectId as string
  const classNumber = classId?.replace('class-', '').replace('th', '')
  const subjectName = getSubjectDisplayName(subjectId)

  // Check if user can access this class
  useEffect(() => {
    if (!isProfileComplete()) {
      router.push('/profile')
      return
    }
    
    // Check if user can access this class based on subscription type
    if (!canAccessClass(classNumber, {
      currentClass: preferences.currentClass,
      subscriptionType: preferences.subscriptionType
    })) {
      // Redirect to user's accessible class
      router.push(`/questions/${preferences.currentClass}`)
      return
    }
  }, [classNumber, preferences, isProfileComplete, router])

  // Sample quiz topics (in real app, this would come from database)
  const getQuizTopics = () => {
    const topics = {
      'mathematics': [
        { id: 'algebra', name: 'Algebra', difficulty: 'Medium', questions: 20, duration: 25, bestScore: 85, rating: 4.2 },
        { id: 'geometry', name: 'Geometry', difficulty: 'Hard', questions: 15, duration: 20, bestScore: 78, rating: 4.5 },
        { id: 'arithmetic', name: 'Arithmetic', difficulty: 'Easy', questions: 25, duration: 30, bestScore: 92, rating: 4.1 },
        { id: 'statistics', name: 'Statistics', difficulty: 'Medium', questions: 18, duration: 22, bestScore: 88, rating: 4.3 }
      ],
      'science': [
        { id: 'physics', name: 'Physics Basics', difficulty: 'Medium', questions: 20, duration: 25, bestScore: 82, rating: 4.0 },
        { id: 'chemistry', name: 'Chemical Reactions', difficulty: 'Hard', questions: 15, duration: 20, bestScore: 75, rating: 4.4 },
        { id: 'biology', name: 'Life Processes', difficulty: 'Easy', questions: 22, duration: 28, bestScore: 89, rating: 4.2 }
      ],
      'english': [
        { id: 'grammar', name: 'Grammar', difficulty: 'Easy', questions: 25, duration: 20, bestScore: 91, rating: 4.3 },
        { id: 'comprehension', name: 'Reading Comprehension', difficulty: 'Medium', questions: 15, duration: 30, bestScore: 86, rating: 4.1 },
        { id: 'literature', name: 'Literature', difficulty: 'Hard', questions: 12, duration: 25, bestScore: 79, rating: 4.6 }
      ]
    }
    
    return topics[subjectId as keyof typeof topics] || [
      { id: 'general', name: 'General Questions', difficulty: 'Medium', questions: 20, duration: 25, bestScore: 0, rating: 0 }
    ]
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleStartQuestions = (topicId: string) => {
    // In real app, this would navigate to actual questions
    router.push(`/questions/${classId}/${subjectId}/${topicId}/start`)
  }

  const topics = getQuizTopics()

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <button 
              onClick={() => router.back()} 
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <ChevronRight className="w-4 h-4" />
            <span>Questions</span>
            <ChevronRight className="w-4 h-4" />
            <span className="capitalize">{classId?.replace('-', ' ')}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{subjectName}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <span>{subjectName} Questions</span>
          </h1>
        </div>

        {/* Quiz Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <Card 
              key={topic.id}
              className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 group"
            >
              <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 border-b border-gray-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-purple-700">{index + 1}</span>
                    </div>
                    <span className="text-gray-800">{topic.name}</span>
                  </div>
                  <Badge className={getDifficultyColor(topic.difficulty)}>
                    {topic.difficulty}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => handleStartQuestions(topic.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Questions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </AppLayout>
  )
} 