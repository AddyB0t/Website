'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { ClassroomLayout, LearningResourcesSection } from '@/components/ClassroomLayout'
import { Calculator, Atom, Globe, Languages, BookOpen, Users, Trophy } from 'lucide-react'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

export default function Class9QuestionsPage() {
  const router = useRouter()
  const { preferences, isProfileComplete } = useUserPreferences()
  
  // Check if user can access this class
  useEffect(() => {
    if (!isProfileComplete()) {
      router.push('/profile')
      return
    }
  }, [isProfileComplete, router])

  // Define subjects available for Class 9
  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: <Calculator className="w-6 h-6" />,
      description: 'Comprehensive algebra, coordinate geometry, statistics, and probability for Class 9 board preparation.',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50',
      available: true,
      topics: 15
    },
    {
      id: 'science',
      name: 'Science',
      icon: <Atom className="w-6 h-6" />,
      description: 'In-depth physics, chemistry, and biology topics with practical applications aligned with Class 9 board syllabus.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      available: true,
      topics: 15
    },
    {
      id: 'social-science',
      name: 'Social Studies',
      icon: <Globe className="w-6 h-6" />,
      description: 'Contemporary history, political science, economics and geography topics for Class 9 board examinations.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      available: true,
      topics: 24
    },
    {
      id: 'english',
      name: 'English',
      icon: <Languages className="w-6 h-6" />,
      description: 'Literature analysis, advanced writing techniques, and grammar mastery for Class 9 students.',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      available: true,
      topics: 11
    },
    {
      id: 'hindi',
      name: 'Hindi',
      icon: <Languages className="w-6 h-6" />,
      description: 'Advanced Hindi literature, grammar, and composition skills for Class 9 curriculum.',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      available: false,
      topics: 13
    }
  ]

  const learningResources = [
    {
      title: "Exam Preparation",
      items: [
        "Monday: Practice Tests & Problem Solving",
        "Wednesday: Board Exam Sample Papers", 
        "Friday: Topic-wise Revision Sessions"
      ]
    },
    {
      title: "Recommended Materials",
      items: [
        "NCERT Mathematics Class 9",
        "NCERT Science Class 9",
        "Board Examination Guide - Class 9"
      ]
    }
  ]

  const additionalSections = (
    <LearningResourcesSection 
      title="Class 9 Learning Resources" 
      resources={learningResources} 
    />
  )

  return (
    <AppLayout>
      <ClassroomLayout
        title="Welcome to Your Class 9 Classroom!"
        description="Explore your subjects below. Each card leads to lessons, practice exercises, and resources aligned with your Class 9 curriculum to help you prepare for board examinations."
        subjects={subjects}
        additionalSections={additionalSections}
      />
    </AppLayout>
  )
} 