'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { 
  Calculator, 
  Atom, 
  Globe, 
  Languages, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Star,
  GraduationCap,
  Users,
  Brain,
  Eye,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react'
import Link from 'next/link'

export default function PreviewClassPage() {
  const params = useParams()
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  
  const classId = params.classId as string
  const classNumber = classId

  // Get class information
  const getClassInfo = (classId: string) => {
    const classMap: Record<string, any> = {
      '6': {
        title: 'Class 6',
        description: 'Primary to Middle School Transition',
        icon: <BookOpen className="w-8 h-8" />,
        color: 'from-blue-500 to-cyan-500'
      },
      '7': {
        title: 'Class 7',
        description: 'Building Strong Foundations',
        icon: <Users className="w-8 h-8" />,
        color: 'from-green-500 to-emerald-500'
      },
      '8': {
        title: 'Class 8',
        description: 'Expanding Knowledge Horizons',
        icon: <Brain className="w-8 h-8" />,
        color: 'from-purple-500 to-pink-500'
      },
      '9': {
        title: 'Class 9',
        description: 'Preparing for Board Exams',
        icon: <GraduationCap className="w-8 h-8" />,
        color: 'from-orange-500 to-red-500'
      },
      '10': {
        title: 'Class 10',
        description: 'Board Exam Preparation',
        icon: <GraduationCap className="w-8 h-8" />,
        color: 'from-red-500 to-rose-500'
      },
      '11': {
        title: 'Class 11',
        description: 'Stream Specialization',
        icon: <GraduationCap className="w-8 h-8" />,
        color: 'from-indigo-500 to-purple-500'
      },
      '12': {
        title: 'Class 12',
        description: 'Final Board Examinations',
        icon: <GraduationCap className="w-8 h-8" />,
        color: 'from-violet-500 to-fuchsia-500'
      }
    }
    return classMap[classId] || classMap['6']
  }

  // Get subjects for class
  const getSubjects = (classId: string) => {
    const isHigherSecondary = classId === '11' || classId === '12'
    
    if (isHigherSecondary) {
      return [
        {
          id: 'science',
          name: 'Science Stream',
          icon: <Atom className="w-6 h-6" />,
          description: 'Physics, Chemistry, Biology/Mathematics with advanced concepts',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'from-green-50 to-emerald-50',
          subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English']
        },
        {
          id: 'commerce',
          name: 'Commerce Stream',
          icon: <Calculator className="w-6 h-6" />,
          description: 'Business Studies, Accountancy, Economics fundamentals',
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'from-blue-50 to-cyan-50',
          subjects: ['Business Studies', 'Accountancy', 'Economics', 'English']
        },
        {
          id: 'humanities',
          name: 'Humanities Stream',
          icon: <Globe className="w-6 h-6" />,
          description: 'History, Political Science, Geography, Literature',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'from-purple-50 to-pink-50',
          subjects: ['History', 'Political Science', 'Geography', 'English']
        }
      ]
    } else {
      return [
        {
          id: 'mathematics',
          name: 'Mathematics',
          icon: <Calculator className="w-6 h-6" />,
          description: 'Numbers, Algebra, Geometry, Data Handling',
          color: 'from-blue-500 to-purple-500',
          bgColor: 'from-blue-50 to-purple-50',
          topics: ['Integers', 'Fractions', 'Decimals', 'Geometry', 'Algebra']
        },
        {
          id: 'science',
          name: 'Science',
          icon: <Atom className="w-6 h-6" />,
          description: 'Physics, Chemistry, Biology concepts',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'from-green-50 to-emerald-50',
          topics: ['Motion', 'Light', 'Matter', 'Living World', 'Natural Resources']
        },
        {
          id: 'social-science',
          name: 'Social Science',
          icon: <Globe className="w-6 h-6" />,
          description: 'History, Geography, Civics',
          color: 'from-orange-500 to-red-500',
          bgColor: 'from-orange-50 to-red-50',
          topics: ['History', 'Geography', 'Civics', 'Economics']
        },
        {
          id: 'english',
          name: 'English',
          icon: <Languages className="w-6 h-6" />,
          description: 'Literature, Grammar, Writing Skills',
          color: 'from-pink-500 to-rose-500',
          bgColor: 'from-pink-50 to-rose-50',
          topics: ['Reading', 'Writing', 'Grammar', 'Literature', 'Poetry']
        }
      ]
    }
  }

  const classInfo = getClassInfo(classId)
  const subjects = getSubjects(classId)

  const handleSubjectClick = (subject: any) => {
    setSelectedSubject(subject.name)
    
    if (isLoaded) {
      if (isSignedIn) {
        // User is signed in, redirect to profile
        router.push('/profile')
      } else {
        // User is not signed in, show authentication modal
        setShowAuthModal(true)
      }
    }
  }

  const handleGoToSignUp = () => {
    router.push('/sign-up')
  }

  const handleGoToSignIn = () => {
    router.push('/sign-in')
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
            onClick={() => router.back()}
            className="text-gray-600"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
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
          {/* Class Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Eye className="w-4 h-4" />
              <span>Preview Mode</span>
              <ChevronRight className="w-4 h-4" />
              <span>{classInfo.title}</span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${classInfo.color} flex items-center justify-center text-white`}>
                {classInfo.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{classInfo.title} Subjects</h1>
                <p className="text-gray-600 text-lg">{classInfo.description}</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <p className="text-blue-800">
                  <strong>Preview Mode:</strong> You're exploring {classInfo.title} subjects. 
                  Click on any subject to access full content after signing up!
                </p>
              </div>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card 
                key={subject.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-white border-0 shadow-md"
                onClick={() => handleSubjectClick(subject)}
              >
                <CardContent className="p-6">
                  <div className={`w-full h-32 bg-gradient-to-r ${subject.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${subject.color} flex items-center justify-center text-white`}>
                      {subject.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                  <p className="text-gray-600 mb-4">{subject.description}</p>
                  
                  {'topics' in subject && subject.topics && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {subject.topics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {subject.topics.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{subject.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {'subjects' in subject && subject.subjects && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Subjects:</p>
                      <div className="flex flex-wrap gap-1">
                        {subject.subjects.slice(0, 3).map((sub, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                        {subject.subjects.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{subject.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Sign up to access</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start Learning?</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of students who are already excelling with ZapUp. 
                Get access to comprehensive study materials, practice questions, and AI-powered solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleGoToSignUp}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Sign Up Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleGoToSignIn}
                  className="border-blue-300 text-blue-800 hover:bg-blue-50"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Already have an account?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Authentication Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Access {selectedSubject}
            </DialogTitle>
            <DialogDescription className="text-center">
              Sign up or sign in to access full content and start your learning journey!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleGoToSignUp}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Sign Up Free
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-blue-300 text-blue-800 hover:bg-blue-50"
              onClick={handleGoToSignIn}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 