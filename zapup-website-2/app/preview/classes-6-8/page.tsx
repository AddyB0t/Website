'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Brain, ChevronLeft, ChevronRight, GraduationCap, UserPlus, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function MiddleSchoolPreview() {
  const router = useRouter()

  const middleSchoolClasses = [
    {
      id: '6',
      title: 'Class 6',
      description: 'Primary to Middle School Transition',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English'],
      features: ['Basic concepts introduction', 'Interactive learning', 'Foundation building']
    },
    {
      id: '7',
      title: 'Class 7',
      description: 'Building Strong Foundations',
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English'],
      features: ['Concept strengthening', 'Problem solving', 'Critical thinking']
    },
    {
      id: '8',
      title: 'Class 8',
      description: 'Expanding Knowledge Horizons',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English'],
      features: ['Advanced concepts', 'Analytical skills', 'Preparation for high school']
    }
  ]

  const handleClassSelect = (classId: string) => {
    router.push(`/preview/${classId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#333" strokeWidth="2" fill="white" />
                <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#333" />
                <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-gray-800 font-light tracking-widest uppercase text-lg">ZapUp</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/')}
            className="text-gray-600"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center space-x-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-blue-800 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <span>Preview</span>
              <ChevronRight className="w-4 h-4" />
              <span>Middle School</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Middle School Programs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build a strong foundation in core subjects with our engaging content designed specifically for students transitioning from primary to middle school education.
            </p>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {middleSchoolClasses.map((classItem) => (
              <Card 
                key={classItem.id}
                className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 bg-white border-0 shadow-lg overflow-hidden"
                onClick={() => handleClassSelect(classItem.id)}
              >
                <CardContent className="p-0">
                  <div className={`w-full h-48 bg-gradient-to-r ${classItem.color} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        {classItem.icon}
                      </div>
                      <h3 className="text-2xl font-bold">{classItem.title}</h3>
                      <p className="text-white/90 mt-2">{classItem.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Core Subjects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {classItem.subjects.map((subject, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {classItem.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClassSelect(classItem.id)
                      }}
                    >
                      Explore {classItem.title} Subjects
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
              <GraduationCap className="w-16 h-16 mx-auto mb-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Learning Journey?</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Join thousands of middle school students who are building strong foundations with ZapUp. 
                Get access to interactive lessons, practice questions, and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/sign-up')}
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Start Learning Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => router.push('/sign-in')}
                  className="border-blue-300 text-blue-800 hover:bg-blue-50 px-8"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Already have an account?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 