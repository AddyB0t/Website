'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  LogIn,
  Lock,
  Crown
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { filterClassesByAccess, getUpgradeMessage, getSubscriptionDisplayInfo } from '@/lib/access-control'

export default function ClassesPage() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { preferences } = useUserPreferences()

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

  // Filter classes based on subscription if user is signed in
  const filteredClasses = isSignedIn 
    ? filterClassesByAccess(allClasses, preferences.subscriptionType, preferences.currentClass)
    : allClasses.map(cls => ({ ...cls, accessible: true, requiresUpgrade: false }))

  const subscriptionInfo = isSignedIn ? getSubscriptionDisplayInfo(preferences.subscriptionType) : null

  const handleProgramPreview = (href: string) => {
    router.push(href)
  }

  const handleClassPreview = (classId: string, accessible: boolean, requiresUpgrade: boolean) => {
    if (!isSignedIn) {
      router.push(`/preview/${classId}`)
      return
    }

    if (accessible) {
      router.push(`/preview/${classId}`)
    } else if (requiresUpgrade) {
      // Redirect to pricing page with the class context
      router.push(`/pricing?upgrade=${classId}`)
    }
  }

  const getClassCardStyle = (accessible: boolean, requiresUpgrade: boolean) => {
    if (!isSignedIn || accessible) {
      return "cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-white border-0 shadow-md"
    }
    return "cursor-pointer transition-all hover:shadow-md bg-gray-50 border-2 border-dashed border-gray-300 opacity-75"
  }

  const getButtonText = (accessible: boolean, requiresUpgrade: boolean) => {
    if (!isSignedIn || accessible) return "Preview"
    if (requiresUpgrade) return "Upgrade"
    return "Preview"
  }

  const getButtonIcon = (accessible: boolean, requiresUpgrade: boolean) => {
    if (!isSignedIn || accessible) return <Eye className="w-3 h-3 ml-1" />
    if (requiresUpgrade) return <Crown className="w-3 h-3 ml-1" />
    return <Eye className="w-3 h-3 ml-1" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header with subscription info */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Classes & Programs</h1>
              <p className="text-gray-600">Choose your learning path</p>
            </div>
            {isSignedIn && subscriptionInfo && (
              <div className="flex items-center space-x-3">
                <Badge className={`bg-${subscriptionInfo.color}-100 text-${subscriptionInfo.color}-800`}>
                  {subscriptionInfo.name} Plan
                </Badge>
                <Link href="/pricing">
                  <Button variant="outline" size="sm">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

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
              {classPrograms.map((program, index) => (
                <Card key={program.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className={`${program.bgColor} p-6 text-center ${program.borderColor} border-b`}>
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${program.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                      {program.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-lg font-medium text-gray-700 mb-4">{program.subtitle}</p>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                    
                    {/* Classes */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        Classes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {program.classes.map((className) => (
                          <Badge key={className} variant="outline" className="text-xs">
                            {className}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Subjects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {program.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Features
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {program.features.map((feature) => (
                          <li key={feature} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className={`w-full bg-gradient-to-r ${program.color} text-white hover:shadow-lg transition-all duration-200`}
                      onClick={() => handleProgramPreview(program.href)}
                    >
                      Explore Program
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
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
              {filteredClasses.map((classItem) => (
                <Card 
                  key={classItem.id}
                  className={getClassCardStyle(classItem.accessible, classItem.requiresUpgrade)}
                  onClick={() => handleClassPreview(classItem.id, classItem.accessible, classItem.requiresUpgrade)}
                >
                  <CardContent className="p-4 text-center relative">
                    {classItem.requiresUpgrade && (
                      <div className="absolute top-2 right-2">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-${classItem.color}-500 to-${classItem.color}-600 flex items-center justify-center text-white mx-auto mb-3 ${!classItem.accessible ? 'opacity-60' : ''}`}>
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <h3 className={`font-bold mb-1 ${classItem.accessible ? 'text-gray-900' : 'text-gray-500'}`}>
                      {classItem.name}
                    </h3>
                    <p className={`text-xs mb-3 ${classItem.accessible ? 'text-gray-600' : 'text-gray-400'}`}>
                      {classItem.category}
                    </p>
                    {classItem.requiresUpgrade && (
                      <Badge variant="outline" className="text-xs mb-2 border-orange-300 text-orange-600">
                        Upgrade Required
                      </Badge>
                    )}
                    <Button 
                      size="sm" 
                      variant={classItem.accessible ? "outline" : "default"}
                      className={`text-xs ${classItem.requiresUpgrade ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClassPreview(classItem.id, classItem.accessible, classItem.requiresUpgrade)
                      }}
                    >
                      {getButtonText(classItem.accessible, classItem.requiresUpgrade)}
                      {getButtonIcon(classItem.accessible, classItem.requiresUpgrade)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already excelling with our comprehensive learning platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {!isSignedIn ? (
                <>
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                      <UserPlus className="w-5 h-5 mr-2" />
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/pricing">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade Plan
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 