// zapup-website-2/app/questions/7/page.tsx
// Class 7 Questions Home Page - Shows all available subjects for Class 7
// This page is accessed when users click "Class 7" in navigation

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, BookOpen, ChevronRight, Calculator, Atom, Globe, Languages, Star, Trophy, Clock } from 'lucide-react'
import Link from 'next/link'

export default function Class7QuestionsPage() {
  const router = useRouter()
  
  // Define subjects available for Class 7
  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: <Calculator className="w-6 h-6" />,
      description: 'Integers, Fractions, Algebraic Expressions, Geometry',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50',
      available: true,
      topics: 8
    },
    {
      id: 'science',
      name: 'Science',
      icon: <Atom className="w-6 h-6" />,
      description: 'Physics, Chemistry, Biology concepts',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      available: false,
      topics: 12
    },
    {
      id: 'social-science',
      name: 'Social Science',
      icon: <Globe className="w-6 h-6" />,
      description: 'History, Geography, Civics',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      available: false,
      topics: 10
    },
    {
      id: 'english',
      name: 'English',
      icon: <Languages className="w-6 h-6" />,
      description: 'Literature, Grammar, Writing Skills',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      available: false,
      topics: 15
    },
    {
      id: 'hindi',
      name: 'Hindi',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'साहित्य, व्याकरण, लेखन कौशल',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50',
      available: false,
      topics: 12
    }
  ]

  const handleSubjectClick = (subjectId: string, available: boolean) => {
    if (available) {
      router.push(`/questions/7/${subjectId}`)
    }
  }

  const availableSubjects = subjects.filter(s => s.available)
  const comingSoonSubjects = subjects.filter(s => !s.available)

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Link href="/questions" className="hover:text-blue-600">Questions</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Class 7</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <span>Class 7 Questions</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Practice questions across all subjects for Class 7. Start with Mathematics and explore more subjects coming soon!
          </p>
        </div>

        {/* Available Subjects */}
        {availableSubjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5 text-green-500" />
              <span>Available Now</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSubjects.map((subject) => (
                <Card 
                  key={subject.id}
                  className="bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handleSubjectClick(subject.id, subject.available)}
                >
                  <CardHeader className={`bg-gradient-to-br ${subject.bgColor} border-b border-gray-100`}>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-gradient-to-r ${subject.color} rounded-lg text-white`}>
                          {subject.icon}
                        </div>
                        <div>
                          <span className="text-gray-800 font-semibold">{subject.name}</span>
                          <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                            {subject.topics} Topics
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
                    <Button 
                      className={`w-full bg-gradient-to-r ${subject.color} hover:opacity-90 text-white transition-all duration-200`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSubjectClick(subject.id, subject.available)
                      }}
                    >
                      Start Questions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Subjects */}
        {comingSoonSubjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Coming Soon</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonSubjects.map((subject) => (
                <Card 
                  key={subject.id}
                  className="bg-gray-50 border border-gray-200 opacity-75"
                >
                  <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-300 rounded-lg text-gray-600">
                          {subject.icon}
                        </div>
                        <div>
                          <span className="text-gray-600 font-semibold">{subject.name}</span>
                          <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
                            Coming Soon
                          </Badge>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-sm mb-4">{subject.description}</p>
                    <Button 
                      className="w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}


      </div>
    </AppLayout>
  )
} 