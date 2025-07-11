'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { ClassroomLayout, LearningResourcesSection } from '@/components/ClassroomLayout'
import { Calculator, Atom, Globe, Languages, BookOpen, Laptop, Palette } from 'lucide-react'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

export default function Class6QuestionsPage() {
  const router = useRouter()
  const { preferences, isProfileComplete } = useUserPreferences()
  
  // Check if user can access this class
  useEffect(() => {
    if (!isProfileComplete()) {
      router.push('/profile')
      return
    }
  }, [isProfileComplete, router])

  // Define subjects available for Class 6
  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: <Calculator className="w-6 h-6" />,
      description: 'Numbers, algebra, geometry, and data handling with interactive lessons tailored for Class 6 students.',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50',
      available: true,
      topics: 14
    },
    {
      id: 'science',
      name: 'Science',
      icon: <Atom className="w-6 h-6" />,
      description: 'Introduction to physics, chemistry, and biology concepts suitable for Class 6 curriculum.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      available: true,
      topics: 16
    },
    {
      id: 'social-science',
      name: 'Social Studies',
      icon: <Globe className="w-6 h-6" />,
      description: 'Explore history, geography, and civics topics from ancient to medieval India.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      available: true,
      topics: 22
    },
    {
      id: 'english',
      name: 'English',
      icon: <Languages className="w-6 h-6" />,
      description: 'Reading, writing, grammar, and literature skills through engaging Class 6 exercises.',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      available: true,
      topics: 12
    },
    {
      id: 'hindi',
      name: 'Hindi',
      icon: <Languages className="w-6 h-6" />,
      description: 'Develop Hindi language skills through stories and activities designed for Class 6.',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      available: false,
      topics: 10
    },
    {
      id: 'computer',
      name: 'Computer Studies / Applications',
      icon: <Laptop className="w-6 h-6" />,
      description: 'Basic computer concepts and skills appropriate for Class 6 students.',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50',
      available: false,
      topics: 8
    },
    {
      id: 'scholastic',
      name: 'Scholastic',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Life skills through environmental studies and general knowledge for Class 6.',
      color: 'from-teal-500 to-green-500',
      bgColor: 'from-teal-50 to-green-50',
      available: false,
      topics: 6
    },
    {
      id: 'art',
      name: 'Art & Craft',
      icon: <Palette className="w-6 h-6" />,
      description: 'Creative projects and activities suitable for Class 6 students.',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      available: false,
      topics: 12
    }
  ]

  const learningResources = [
    {
      title: "Recommended Books",
      items: [
        "NCERT Mathematics Class 6",
        "NCERT Science Class 6", 
        "NCERT Social Science Class 6"
      ]
    },
    {
      title: "Weekly Schedule",
      items: [
        "Monday: Mathematics & Science Quiz",
        "Wednesday: Language & Social Studies",
        "Friday: Weekly Review & Activities"
      ]
    }
  ]

  const additionalSections = (
    <LearningResourcesSection 
      title="Class 6 Learning Resources" 
      resources={learningResources} 
    />
  )

  return (
    <AppLayout>
      <ClassroomLayout
        title="Welcome to Your Class 6 Classroom!"
        description="Explore your subjects below. Each card leads to lessons, practice exercises, and resources aligned with your Class 6 curriculum."
        subjects={subjects}
        additionalSections={additionalSections}
      />
    </AppLayout>
  )
} 