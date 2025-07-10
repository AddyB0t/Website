'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, Trophy, ChevronLeft, ChevronRight, UserPlus, LogIn, Target } from 'lucide-react'
import Link from 'next/link'

export default function SecondarySchoolPreview() {
  const router = useRouter()

  const secondarySchoolClasses = [
    {
      id: '9',
      title: 'Class 9',
      description: 'Preparing for Board Exams',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English'],
      features: ['Board exam preparation', 'Advanced problem solving', 'Competitive exam foundation'],
      highlights: ['Foundation for Class 10', 'NCERT aligned curriculum', 'Exam strategies']
    },
    {
      id: '10',
      title: 'Class 10',
      description: 'Board Exam Preparation',
      icon: <Trophy className="w-8 h-8" />,
      color: 'from-red-500 to-rose-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English'],
      features: ['Board exam mastery', 'Previous year papers', 'Performance analysis'],
      highlights: ['CBSE/ICSE preparation', 'Mock tests', 'Expert guidance']
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
              <span>Secondary School</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Secondary School Programs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive preparation for board examinations with detailed explanations, practice tests, and exam strategies aligned with CBSE, ICSE, and state board requirements.
            </p>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            {secondarySchoolClasses.map((classItem) => (
              <Card 
                key={classItem.id}
                className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 bg-white border-0 shadow-lg overflow-hidden"
                onClick={() => handleClassSelect(classItem.id)}
              >
                <CardContent className="p-0">
                  <div className={`w-full h-56 bg-gradient-to-r ${classItem.color} flex items-center justify-center relative`}>
                    <div className="text-center text-white z-10">
                      <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        {classItem.icon}
                      </div>
                      <h3 className="text-3xl font-bold">{classItem.title}</h3>
                      <p className="text-white/90 mt-2 text-lg">{classItem.description}</p>
                    </div>
                    {/* Background pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Core Subjects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {classItem.subjects.map((subject, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
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
                            <Target className="w-3 h-3 text-orange-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                      <ul className="space-y-1">
                        {classItem.highlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 mt-4"
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

          {/* Success Stats */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 mb-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Board Exam Success</h3>
              <p className="text-gray-600">Our students consistently achieve excellent results</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">95%+</div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">85%+</div>
                <div className="text-sm text-gray-600">Above 80% Marks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600 mb-1">10,000+</div>
                <div className="text-sm text-gray-600">Successful Students</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
              <Trophy className="w-16 h-16 mx-auto mb-6 text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ace Your Board Exams!</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Join thousands of successful students who achieved outstanding results with ZapUp. 
                Get access to comprehensive study materials, mock tests, and expert guidance for board exam success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/sign-up')}
                  className="bg-red-600 hover:bg-red-700 px-8"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Start Preparing Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => router.push('/sign-in')}
                  className="border-red-300 text-red-800 hover:bg-red-50 px-8"
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