'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, Star, ChevronLeft, ChevronRight, UserPlus, LogIn, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function HigherSecondaryPreview() {
  const router = useRouter()

  const higherSecondaryClasses = [
    {
      id: '11',
      title: 'Class 11',
      description: 'Stream Specialization',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      streams: ['Science', 'Commerce', 'Humanities'],
      features: ['Stream-based learning', 'Foundation building', 'Career guidance'],
      highlights: ['PCM/PCB tracks', 'Business & Economics', 'Arts & Literature'],
      subjects: {
        Science: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
        Commerce: ['Business Studies', 'Accountancy', 'Economics'],
        Humanities: ['History', 'Political Science', 'Geography', 'Psychology']
      }
    },
    {
      id: '12',
      title: 'Class 12',
      description: 'Final Board Examinations',
      icon: <Star className="w-8 h-8" />,
      color: 'from-violet-500 to-fuchsia-500',
      streams: ['Science', 'Commerce', 'Humanities'],
      features: ['Board exam mastery', 'Entrance exam prep', 'Career counseling'],
      highlights: ['JEE/NEET preparation', 'Professional courses', 'University admissions'],
      subjects: {
        Science: ['Advanced Physics', 'Organic Chemistry', 'Calculus', 'Biotechnology'],
        Commerce: ['Advanced Accountancy', 'Business Strategy', 'Micro Economics'],
        Humanities: ['Contemporary History', 'International Relations', 'Philosophy']
      }
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
              <span>Higher Secondary</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Higher Secondary Programs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              In-depth coverage of specialized subjects with advanced concepts, solved examples, and preparation materials for board exams and competitive entrance tests.
            </p>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            {higherSecondaryClasses.map((classItem) => (
              <Card 
                key={classItem.id}
                className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 bg-white border-0 shadow-lg overflow-hidden"
                onClick={() => handleClassSelect(classItem.id)}
              >
                <CardContent className="p-0">
                  <div className={`w-full h-64 bg-gradient-to-r ${classItem.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="text-center text-white z-10">
                      <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        {classItem.icon}
                      </div>
                      <h3 className="text-3xl font-bold">{classItem.title}</h3>
                      <p className="text-white/90 mt-2 text-lg">{classItem.description}</p>
                    </div>
                    {/* Background pattern */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Available Streams:</h4>
                      <div className="flex flex-wrap gap-2">
                        {classItem.streams.map((stream, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                          >
                            {stream}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {classItem.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <BookOpen className="w-3 h-3 text-purple-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Specializations:</h4>
                      <ul className="space-y-1">
                        {classItem.highlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sample subjects for each stream */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Sample Subjects:</h4>
                      <div className="space-y-2">
                        {Object.entries(classItem.subjects).map(([stream, subjects]) => (
                          <div key={stream} className="text-xs">
                            <span className="font-medium text-gray-700">{stream}:</span>
                            <span className="text-gray-600 ml-1">
                              {subjects.slice(0, 2).join(', ')}
                              {subjects.length > 2 && ' +more'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClassSelect(classItem.id)
                      }}
                    >
                      Explore {classItem.title} Streams
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Career Guidance Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 mb-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Career Pathways</h3>
              <p className="text-gray-600">Choose your stream based on your career aspirations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-lg font-semibold text-indigo-600 mb-2">Science Stream</div>
                <div className="text-sm text-gray-600">Engineering, Medicine, Research, Technology</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-lg font-semibold text-purple-600 mb-2">Commerce Stream</div>
                <div className="text-sm text-gray-600">Business, Finance, Banking, Economics</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-lg font-semibold text-violet-600 mb-2">Humanities Stream</div>
                <div className="text-sm text-gray-600">Law, Journalism, Social Work, Literature</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
              <Star className="w-16 h-16 mx-auto mb-6 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shape Your Future!</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Choose your path to success with our comprehensive higher secondary programs. 
                Get expert guidance for board exams and entrance test preparation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/sign-up')}
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Begin Your Journey
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => router.push('/sign-in')}
                  className="border-purple-300 text-purple-800 hover:bg-purple-50 px-8"
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