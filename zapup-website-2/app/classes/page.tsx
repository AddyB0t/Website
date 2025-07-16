'use client'

import { useState, useMemo } from 'react'
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
  Crown,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { filterClassesByAccess, getUpgradeMessage, getSubscriptionDisplayInfo } from '@/lib/access-control'
import { MobileMenuButton } from '@/components/MobileMenuButton'

export default function ClassesPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  
  // Use try-catch pattern for preferences to handle failures gracefully
  let preferences: any = { subscriptionType: 'explorer', currentClass: '' }
  let preferencesLoading = false
  let preferencesError = false
  
  try {
    const prefsContext = useUserPreferences()
    preferences = prefsContext.preferences || { subscriptionType: 'explorer', currentClass: '' }
    preferencesLoading = prefsContext.isLoading
  } catch (error) {
    console.warn('UserPreferences context failed, using fallbacks:', error)
    preferencesError = true
  }

  // Static data - no need to recompute
  const classPrograms = useMemo(() => [
    {
      id: 'middle-school',
      title: 'Middle School',
      subtitle: 'Classes 6-8',
      description: 'Build a strong foundation in core subjects with our engaging content designed specifically for students transitioning from primary to middle school education.',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-100',
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
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-100',
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
      color: 'from-purple-600 to-violet-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
      borderColor: 'border-purple-100',
      icon: <Star className="w-12 h-12" />,
      classes: ['Class 11', 'Class 12'],
      subjects: ['Science Stream', 'Commerce Stream', 'Humanities Stream'],
      features: ['Stream specialization', 'Entrance exam prep', 'Career guidance'],
      href: '/preview/classes-11-12'
    }
  ], [])

  const allClasses = useMemo(() => [
    { id: '6', name: 'Class 6', category: 'Middle School', color: 'blue' },
    { id: '7', name: 'Class 7', category: 'Middle School', color: 'indigo' },
    { id: '8', name: 'Class 8', category: 'Middle School', color: 'purple' },
    { id: '9', name: 'Class 9', category: 'Secondary School', color: 'violet' },
    { id: '10', name: 'Class 10', category: 'Secondary School', color: 'blue' },
    { id: '11', name: 'Class 11', category: 'Higher Secondary', color: 'indigo' },
    { id: '12', name: 'Class 12', category: 'Higher Secondary', color: 'purple' }
  ], [])

  // Memoize expensive computations with error handling
  const { filteredClasses, subscriptionInfo } = useMemo(() => {
    // If auth is not loaded yet, show all classes as accessible
    if (!isLoaded) {
      return {
        filteredClasses: allClasses.map(cls => ({ ...cls, accessible: true, requiresUpgrade: false })),
        subscriptionInfo: null
      }
    }

    // If not signed in, show all classes as accessible for preview
    if (!isSignedIn) {
      return {
        filteredClasses: allClasses.map(cls => ({ ...cls, accessible: true, requiresUpgrade: false })),
        subscriptionInfo: null
      }
    }

    // If preferences are loading or failed, show basic access
    if (preferencesLoading || preferencesError) {
      return {
        filteredClasses: allClasses.map(cls => ({ ...cls, accessible: true, requiresUpgrade: false })),
        subscriptionInfo: null
      }
    }

    // Try to compute access control, but fallback gracefully if it fails
    try {
      return {
        filteredClasses: filterClassesByAccess(allClasses, preferences.subscriptionType || 'explorer', preferences.currentClass || ''),
        subscriptionInfo: getSubscriptionDisplayInfo(preferences.subscriptionType || 'explorer')
      }
    } catch (error) {
      console.warn('Access control computation failed, using fallbacks:', error)
      return {
        filteredClasses: allClasses.map(cls => ({ ...cls, accessible: true, requiresUpgrade: false })),
        subscriptionInfo: null
      }
    }
  }, [isLoaded, isSignedIn, preferencesLoading, preferencesError, preferences.subscriptionType, preferences.currentClass, allClasses])

  const handleProgramPreview = (href: string) => {
    router.push(href)
  }

  const handleClassPreview = (classId: string, accessible: boolean, requiresUpgrade: boolean) => {
    if (!isSignedIn || accessible) {
      router.push(`/preview/${classId}`)
    } else if (requiresUpgrade) {
      router.push(`/pricing?upgrade=${classId}`)
    }
  }

  const getClassCardStyle = (accessible: boolean, requiresUpgrade: boolean) => {
    if (requiresUpgrade) {
      return "cursor-pointer hover:shadow-lg transition-all duration-300 border border-orange-200 bg-orange-50/30"
    }
    if (accessible) {
      return "cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white"
    }
    return "cursor-not-allowed opacity-60 border-0 shadow-md bg-gray-50"
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

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Simplified header while loading */}
        <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#3B82F6" strokeWidth="2" fill="white" />
                  <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#3B82F6" />
                  <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-gray-800 font-bold tracking-wide text-xl">ZapUp</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-600 text-sm">Loading...</span>
          </div>
        </header>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Classes</h2>
            <p className="text-gray-600">Please wait while we prepare your learning options...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Header */}
      <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#3B82F6" strokeWidth="2" fill="white" />
                <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#3B82F6" />
                <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-gray-800 font-bold tracking-wide text-xl">ZapUp</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            About
          </Link>
          <Link href="/#subjects" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Subjects
          </Link>
          <Link href="/#learning" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Learning
          </Link>
          <Link href="/classes" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
            Classes
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Contact
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Pricing
          </Link>
          {!isSignedIn ? (
            <div className="flex items-center space-x-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700 font-medium">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/profile">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium">
                  Profile
                </Button>
              </Link>
              <Link href="/questions">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium">
                  Questions
                </Button>
              </Link>
              <Link href="/books">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium">
                  Books
                </Button>
              </Link>
            </div>
          )}
        </nav>
        <MobileMenuButton />
      </header>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Subscription Info Header - only show if we have valid subscription info */}
        {isSignedIn && !preferencesLoading && !preferencesError && subscriptionInfo && (
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">Classes & Programs</h1>
                  <p className="text-gray-600">Choose your learning path</p>
                </div>
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
              </div>
            </div>
          </div>
        )}

        {/* Error state for preferences - non-blocking */}
        {isSignedIn && preferencesError && (
          <div className="bg-yellow-50 border-b border-yellow-200">
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="flex items-center space-x-2 text-yellow-800">
                <span className="text-sm">⚠️ Some features may be limited due to a connection issue. All content is still accessible.</span>
              </div>
            </div>
          </div>
        )}

        <main className="py-16 px-6 md:px-12 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6 tracking-wide">
                Choose Your Learning Path
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore our comprehensive class programs designed to help students excel at every level. 
                From building foundations to mastering advanced concepts.
              </p>
            </div>

            {/* Class Programs Section */}
            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-light text-gray-800 text-center mb-4">Class Programs</h2>
              <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                Each program is carefully designed to match the specific needs and challenges of different educational stages.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {classPrograms.map((program, index) => (
                  <Card key={program.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                    <div className={`${program.bgColor} p-8 text-center relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-gradient-to-br from-white to-transparent"></div>
                      </div>
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${program.color} flex items-center justify-center text-white mx-auto mb-6 shadow-lg relative z-10`}>
                        {program.icon}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3 relative z-10">{program.title}</h3>
                      <p className="text-lg text-gray-600 mb-4 relative z-10">{program.subtitle}</p>
                    </div>
                    
                    <CardContent className="p-8">
                      <p className="text-gray-600 mb-8 leading-relaxed">{program.description}</p>
                      
                      {/* Classes */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                          Classes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {program.classes.map((className) => (
                            <Badge key={className} variant="outline" className="text-xs border-gray-200 text-gray-600">
                              {className}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Subjects */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                          Subjects
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {program.subjects.map((subject) => (
                            <Badge key={subject} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-8">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <Star className="w-4 h-4 mr-2 text-gray-500" />
                          Features
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {program.features.map((feature) => (
                            <li key={feature} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-60"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        className={`w-full bg-gradient-to-r ${program.color} hover:shadow-lg transition-all duration-300 text-white border-0`}
                        onClick={() => handleProgramPreview(program.href)}
                      >
                        Explore Program
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Individual Classes Section */}
            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-light text-gray-800 text-center mb-4">Or Browse Individual Classes</h2>
              <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
                Click on any class to explore its specific subjects and curriculum
              </p>
              
              {preferencesLoading && isSignedIn ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading class options...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {filteredClasses.map((classItem) => (
                    <Card 
                      key={classItem.id}
                      className={getClassCardStyle(classItem.accessible, classItem.requiresUpgrade)}
                      onClick={() => handleClassPreview(classItem.id, classItem.accessible, classItem.requiresUpgrade)}
                    >
                      <CardContent className="p-6 text-center relative">
                        {classItem.requiresUpgrade && (
                          <div className="absolute top-3 right-3">
                            <Lock className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-${classItem.color}-500 to-${classItem.color}-600 flex items-center justify-center text-white mx-auto mb-4 shadow-md ${!classItem.accessible ? 'opacity-60' : ''}`}>
                          <GraduationCap className="w-8 h-8" />
                        </div>
                        <h3 className={`font-medium mb-2 ${classItem.accessible ? 'text-gray-800' : 'text-gray-500'}`}>
                          {classItem.name}
                        </h3>
                        <p className={`text-xs mb-4 ${classItem.accessible ? 'text-gray-600' : 'text-gray-400'}`}>
                          {classItem.category}
                        </p>
                        {classItem.requiresUpgrade && (
                          <Badge variant="outline" className="text-xs mb-3 border-orange-200 text-orange-600 bg-orange-50">
                            Upgrade Required
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant={classItem.accessible ? "outline" : "default"}
                          className={`text-xs border-gray-200 text-gray-600 hover:bg-gray-50 ${classItem.requiresUpgrade ? 'bg-orange-500 hover:bg-orange-600 text-white border-0' : ''}`}
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
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white shadow-xl">
              <h2 className="text-3xl md:text-4xl font-light mb-6">Ready to Start Learning?</h2>
              <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who are already excelling with our comprehensive learning platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                {!isSignedIn ? (
                  <>
                    <Link href="/sign-up">
                      <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-medium shadow-md">
                        <UserPlus className="w-5 h-5 mr-2" />
                        Start Free Trial
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-medium">
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/pricing">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-medium shadow-md">
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
    </div>
  )
} 