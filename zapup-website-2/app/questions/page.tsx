// zapup-website-2/app/questions/page.tsx
// Index page for questions - shows accessible classes or redirects to user's class

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Loader2, GraduationCap, Lock, Crown, ChevronRight } from 'lucide-react'
import { filterClassesByAccess, getSubscriptionDisplayInfo, canAccessMultipleClasses } from '@/lib/access-control'
import Link from 'next/link'

export default function QuestionsIndexPage() {
  const { preferences, isLoading } = useUserPreferences()
  const router = useRouter()
  const [showClassSelection, setShowClassSelection] = useState(false)

  const allClasses = [
    { id: '6', name: 'Class 6', color: 'blue', subjects: ['Mathematics', 'Science', 'Social Studies', 'English'] },
    { id: '7', name: 'Class 7', color: 'green', subjects: ['Mathematics', 'Science', 'Social Studies', 'English'] },
    { id: '8', name: 'Class 8', color: 'purple', subjects: ['Mathematics', 'Science', 'Social Studies', 'English'] },
    { id: '9', name: 'Class 9', color: 'orange', subjects: ['Mathematics', 'Science', 'Social Studies', 'English'] },
    { id: '10', name: 'Class 10', color: 'red', subjects: ['Mathematics', 'Science', 'Social Studies', 'English'] },
    { id: '11', name: 'Class 11', color: 'indigo', subjects: ['Science/Commerce/Arts'] },
    { id: '12', name: 'Class 12', color: 'violet', subjects: ['Science/Commerce/Arts'] }
  ]

  useEffect(() => {
    if (!isLoading && preferences.currentClass) {
      // Always redirect to user's selected class - they should only see their own class questions
      router.push(`/questions/${preferences.currentClass}`)
    }
  }, [preferences.currentClass, preferences.subscriptionType, isLoading, router])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Questions</h3>
              <p className="text-gray-600">Please wait while we prepare your questions...</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  if (!preferences.currentClass) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600 mb-4">Please complete your profile to access questions.</p>
              <Button onClick={() => router.push('/profile')}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  // Filter classes based on subscription access
  const filteredClasses = filterClassesByAccess(allClasses, preferences.subscriptionType, preferences.currentClass)
  const subscriptionInfo = getSubscriptionDisplayInfo(preferences.subscriptionType)

  const handleClassClick = (classId: string, accessible: boolean, requiresUpgrade: boolean) => {
    if (accessible) {
      router.push(`/questions/${classId}`)
    } else if (requiresUpgrade) {
      router.push(`/pricing?upgrade=${classId}`)
    }
  }

  if (!showClassSelection) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Redirecting to Questions</h3>
              <p className="text-gray-600">Taking you to your class-specific questions...</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Brain className="w-8 h-8 text-purple-600" />
                <span>Questions</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Choose a class to start practicing questions
              </p>
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

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <Card 
              key={classItem.id}
              className={`cursor-pointer transition-all duration-200 ${
                classItem.accessible 
                  ? 'hover:shadow-lg hover:scale-105 bg-white' 
                  : 'bg-gray-50 border-2 border-dashed border-gray-300 opacity-75'
              }`}
              onClick={() => handleClassClick(classItem.id, classItem.accessible, classItem.requiresUpgrade)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-${classItem.color}-500 to-${classItem.color}-600 flex items-center justify-center text-white ${!classItem.accessible ? 'opacity-60' : ''}`}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${classItem.accessible ? 'text-gray-900' : 'text-gray-500'}`}>
                        {classItem.name}
                      </CardTitle>
                    </div>
                  </div>
                  {classItem.requiresUpgrade && (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Subjects: {classItem.subjects.join(', ')}</p>
                </div>
                
                {classItem.requiresUpgrade && (
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                    Upgrade Required
                  </Badge>
                )}

                <Button 
                  className={`w-full ${
                    classItem.accessible 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClassClick(classItem.id, classItem.accessible, classItem.requiresUpgrade)
                  }}
                >
                  {classItem.accessible ? (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Start Questions
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Access
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Class Highlight */}
        {preferences.currentClass && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800">
                <strong>Your Current Class:</strong> Class {preferences.currentClass}
                {preferences.subscriptionType === 'scholar' && (
                  <span className="ml-2 text-blue-600">(Scholar plan allows one class at a time)</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
} 