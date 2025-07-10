'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Users, 
  Brain, 
  GraduationCap, 
  Trophy, 
  Star,
  ChevronRight, 
  ChevronLeft,
  Eye,
  UserPlus,
  LogIn
} from 'lucide-react'
import Link from 'next/link'

export default function ClassesPage() {
  const router = useRouter()

  const classPrograms = [
    {
      id: 'middle-school',
      title: 'Middle School',
      subtitle: 'Classes 6-8',
      description: 'Build a strong foundation in core subjects with our engaging content designed specifically for students transitioning from primary to middle school education.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      icon: <BookOpen className="w-12 h-12" />,
      classes: ['Class 6', 'Class 7', 'Class 8'],
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English'],
      features: ['Interactive learning', 'Foundation building', 'Concept clarity'],
      href: '/preview/classes-6-8'
    },
    {
      id: 'secondary-school',
      title: 'Secondary School',
      subtitle: 'Classes 9-10',
      description: 'Comprehensive preparation for board examinations with detailed explanations, practice tests, and exam strategies aligned with CBSE, ICSE, and state board requirements.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-r from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      icon: <Trophy className="w-12 h-12" />,
      classes: ['Class 9', 'Class 10'],
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English'],
      features: ['Board exam prep', 'Mock tests', 'Expert guidance'],
      href: '/preview/classes-9-10'
    },
    {
      id: 'higher-secondary',
      title: 'Higher Secondary',
      subtitle: 'Classes 11-12',
      description: 'In-depth coverage of specialized subjects with advanced concepts, solved examples, and preparation materials for board exams and competitive entrance tests.',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-gradient-to-r from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200',
      icon: <Star className="w-12 h-12" />,
      classes: ['Class 11', 'Class 12'],
      subjects: ['Science Stream', 'Commerce Stream', 'Humanities Stream'],
      features: ['Stream specialization', 'Entrance exam prep', 'Career guidance'],
      href: '/preview/classes-11-12'
    }
  ]

  const allClasses = [
    { id: '6', name: 'Class 6', category: 'Middle School', color: 'blue' },
    { id: '7', name: 'Class 7', category: 'Middle School', color: 'green' },
    { id: '8', name: 'Class 8', category: 'Middle School', color: 'purple' },
    { id: '9', name: 'Class 9', category: 'Secondary School', color: 'orange' },
    { id: '10', name: 'Class 10', category: 'Secondary School', color: 'red' },
    { id: '11', name: 'Class 11', category: 'Higher Secondary', color: 'indigo' },
    { id: '12', name: 'Class 12', category: 'Higher Secondary', color: 'violet' }
  ]

  const handleProgramPreview = (href: string) => {
    router.push(href)
  }

  const handleClassPreview = (classId: string) => {
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
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Learning Path
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive class programs designed to help students excel at every level. 
              From building foundations to mastering advanced concepts.
            </p>
          </div>

          {/* Class Programs Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Class Programs</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {classPrograms.map((program) => (
                <Card 
                  key={program.id}
                  className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 bg-white border-2 ${program.borderColor} overflow-hidden`}
                  onClick={() => handleProgramPreview(program.href)}
                >
                  <CardContent className="p-0">
                    <div className={`${program.bgColor} p-8 text-center`}>
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${program.color} flex items-center justify-center text-white mx-auto mb-4`}>
                        {program.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                      <p className="text-lg font-medium text-gray-700">{program.subtitle}</p>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Classes Included:</h4>
                        <div className="flex flex-wrap gap-2">
                          {program.classes.map((className, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                            >
                              {className}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Subjects/Streams:</h4>
                        <div className="flex flex-wrap gap-2">
                          {program.subjects.map((subject, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {program.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProgramPreview(program.href)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview {program.title}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Individual Classes Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Or Browse Individual Classes</h2>
            <p className="text-center text-gray-600 mb-12">Click on any class to explore its specific subjects and curriculum</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {allClasses.map((classItem) => (
                <Card 
                  key={classItem.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-white border-0 shadow-md"
                  onClick={() => handleClassPreview(classItem.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-${classItem.color}-500 to-${classItem.color}-600 flex items-center justify-center text-white mx-auto mb-3`}>
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{classItem.name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{classItem.category}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClassPreview(classItem.id)
                      }}
                    >
                      Preview
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
              <GraduationCap className="w-16 h-16 mx-auto mb-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Excel in Your Studies?</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Join thousands of students who are achieving academic excellence with ZapUp's comprehensive learning programs. 
                Start your journey to success today!
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