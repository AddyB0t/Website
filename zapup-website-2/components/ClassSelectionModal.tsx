'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Brain, GraduationCap, Lock, Crown } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { filterClassesByAccess, getSubscriptionDisplayInfo } from '@/lib/access-control'
import Link from 'next/link'

interface ClassSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClassSelect: (classId: string) => void
}

export function ClassSelectionModal({ open, onOpenChange, onClassSelect }: ClassSelectionModalProps) {
  const [selectedClass, setSelectedClass] = useState('')
  const { isSignedIn } = useAuth()
  const { preferences } = useUserPreferences()

  const classOptions = [
    {
      id: '6',
      name: 'Class 6',
      title: 'Class 6',
      description: 'Primary to Middle School Transition',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '7',
      name: 'Class 7',
      title: 'Class 7',
      description: 'Building Strong Foundations',
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '8',
      name: 'Class 8',
      title: 'Class 8',
      description: 'Expanding Knowledge Horizons',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '9',
      name: 'Class 9',
      title: 'Class 9',
      description: 'Preparing for Board Exams',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '10',
      name: 'Class 10',
      title: 'Class 10',
      description: 'Board Exam Preparation',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-red-500 to-rose-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '11',
      name: 'Class 11',
      title: 'Class 11',
      description: 'Stream Specialization',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      subjects: ['Science', 'Commerce', 'Humanities']
    },
    {
      id: '12',
      name: 'Class 12',
      title: 'Class 12',
      description: 'Final Board Examinations',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-violet-500 to-fuchsia-500',
      subjects: ['Science', 'Commerce', 'Humanities']
    }
  ]

  // Filter classes based on subscription if user is signed in
  const filteredClasses = isSignedIn 
    ? filterClassesByAccess(classOptions, preferences.subscriptionType, preferences.currentClass)
    : classOptions.map(cls => ({ ...cls, accessible: true, requiresUpgrade: false }))

  const subscriptionInfo = isSignedIn ? getSubscriptionDisplayInfo(preferences.subscriptionType) : null

  const handleClassClick = (classId: string, accessible: boolean, requiresUpgrade: boolean) => {
    if (!isSignedIn || accessible) {
      setSelectedClass(classId)
      onClassSelect(classId)
      onOpenChange(false)
    } else if (requiresUpgrade) {
      // Close modal and redirect to pricing
      onOpenChange(false)
      window.location.href = `/pricing?upgrade=${classId}`
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">Choose Your Class</DialogTitle>
              <p className="text-gray-600 mt-1">Select a class to preview content and explore subjects</p>
            </div>
            {isSignedIn && subscriptionInfo && (
              <div className="flex items-center space-x-2">
                <Badge className={`bg-${subscriptionInfo.color}-100 text-${subscriptionInfo.color}-800`}>
                  {subscriptionInfo.name} Plan
                </Badge>
                <Link href="/pricing">
                  <Button variant="outline" size="sm">
                    Upgrade
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredClasses.map((classOption) => (
            <Card 
              key={classOption.id}
              className={`cursor-pointer transition-all duration-200 ${
                classOption.accessible 
                  ? 'hover:shadow-lg hover:scale-105 bg-white border-gray-200' 
                  : 'bg-gray-50 border-2 border-dashed border-gray-300 opacity-75'
              }`}
              onClick={() => handleClassClick(classOption.id, classOption.accessible, classOption.requiresUpgrade)}
            >
              <CardContent className="p-4 relative">
                {classOption.requiresUpgrade && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${classOption.color} flex items-center justify-center text-white mx-auto mb-3 ${!classOption.accessible ? 'opacity-60' : ''}`}>
                    {classOption.icon}
                  </div>
                  
                  <h3 className={`font-bold mb-1 ${classOption.accessible ? 'text-gray-900' : 'text-gray-500'}`}>
                    {classOption.title}
                  </h3>
                  
                  <p className={`text-sm mb-3 ${classOption.accessible ? 'text-gray-600' : 'text-gray-400'}`}>
                    {classOption.description}
                  </p>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    {classOption.subjects.join(', ')}
                  </div>
                  
                  {classOption.requiresUpgrade && (
                    <Badge variant="outline" className="text-xs mb-2 border-orange-300 text-orange-600">
                      Upgrade Required
                    </Badge>
                  )}
                  
                  <Button 
                    size="sm" 
                    className={`w-full ${
                      classOption.accessible 
                        ? `bg-gradient-to-r ${classOption.color} text-white hover:shadow-md`
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClassClick(classOption.id, classOption.accessible, classOption.requiresUpgrade)
                    }}
                  >
                    {classOption.accessible ? (
                      'Preview'
                    ) : (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Upgrade
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {!isSignedIn && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <p className="text-blue-800 font-medium mb-2">
                Want full access to all classes and features?
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Link href="/sign-up">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Sign Up Free
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {isSignedIn && subscriptionInfo && subscriptionInfo.name === 'Explorer' && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-center">
              <p className="text-orange-800 font-medium mb-2">
                Explorer plan: Access to Classes 6-8 • Classes 9-12 require upgrade
              </p>
              <Link href="/pricing">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 