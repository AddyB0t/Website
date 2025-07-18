'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { ClassroomLayout, LearningResourcesSection } from '@/components/ClassroomLayout'
import { Calculator, Atom, Globe, Languages, BookOpen, Laptop, Palette } from 'lucide-react'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

export default function Class6BooksPage() {
  const router = useRouter()
  const { preferences, isProfileComplete } = useUserPreferences()
  
  // Check if user can access this class
  useEffect(() => {
    if (!isProfileComplete()) {
      router.push('/profile')
      return
    }
  }, [isProfileComplete, router])

  // Define books available for Class 6
  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: <Calculator className="w-6 h-6" />,
      description: 'NCERT Mathematics textbook with comprehensive coverage of numbers, geometry, and algebra for Class 6.',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50',
      available: true,
      topics: ['Chapter 1: Knowing Our Numbers', 'Chapter 2: Whole Numbers', 'Chapter 3: Playing with Numbers', 'Chapter 4: Basic Geometrical Ideas']
    },
    {
      id: 'science',
      name: 'Science',
      icon: <Atom className="w-6 h-6" />,
      description: 'NCERT Science textbook covering food, materials, living organisms, and natural phenomena for Class 6.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      available: true,
      topics: ['Chapter 1: Food: Where Does it Come From?', 'Chapter 2: Components of Food', 'Chapter 3: Fibre to Fabric', 'Chapter 4: Sorting Materials into Groups']
    },
    {
      id: 'social-science',
      name: 'Social Science',
      icon: <Globe className="w-6 h-6" />,
      description: 'NCERT Social Science covering history, geography, and civics from ancient civilizations to modern India.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      available: true,
      topics: ['History: What, Where, How and When?', 'Geography: The Earth in the Solar System', 'Civics: Understanding Diversity', 'Economics: Economic Activities Around Us']
    },
    {
      id: 'english',
      name: 'English',
      icon: <Languages className="w-6 h-6" />,
      description: 'NCERT English Honeysuckle and A Pact with the Sun with engaging stories, poems, and language exercises.',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      available: true,
      topics: ['Honeysuckle: Who Did Patrick\'s Homework?', 'A Pact with the Sun: A Tale of Two Birds', 'Grammar: Nouns and Pronouns', 'Writing: Descriptive Essays']
    },
    {
      id: 'hindi',
      name: 'Hindi',
      icon: <Languages className="w-6 h-6" />,
      description: 'NCERT Hindi Vasant with stories, poems, and language development activities for Class 6 students.',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      available: false,
      topics: ['वह चिड़िया जो', 'बचपन', 'नादान दोस्त', 'चाँद से थोड़ी सी गप्पें']
    },
    {
      id: 'sanskrit',
      name: 'Sanskrit',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'NCERT Sanskrit Ruchira Part-1 introducing basic Sanskrit grammar, verses, and vocabulary.',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      available: false,
      topics: ['शब्द परिचय', 'सुभाषितानि', 'ईश्वरचन्द्र विद्यासागरः', 'धर्मिकाः समाचाराः']
    }
  ]

  const learningResources = [
    {
      title: "Digital Resources",
      items: [
        "NCERT eBooks and Solutions",
        "Interactive Chapter Summaries", 
        "Practice Worksheets & Exercises"
      ]
    },
    {
      title: "Study Schedule",
      items: [
        "Daily: 30 minutes reading per subject",
        "Weekly: Chapter revision and practice",
        "Monthly: Assessment and progress review"
      ]
    }
  ]

  const additionalSections = (
    <LearningResourcesSection 
      title="Class 6 Book Resources" 
      resources={learningResources} 
    />
  )

  return (
    <AppLayout>
      <ClassroomLayout
        title="Welcome to Your Class 6 Book Library!"
        description="Access your NCERT textbooks and supplementary reading materials. Each subject card provides chapter-wise content aligned with your Class 6 curriculum."
        subjects={subjects}
        additionalSections={additionalSections}
        classId="6"
      />
    </AppLayout>
  )
} 