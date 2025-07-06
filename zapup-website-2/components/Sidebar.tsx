// zapup-website-2/components/Sidebar.tsx
// Main navigation sidebar with class-wise organization
// Shows Profile, Quizzes, Books, Videos with expandable class sections

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  User,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Home,
  Settings,
  LogOut,
  AlertCircle,
  CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SignOutButton } from './SignOutButton'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { getSubjectsByClass } from '@/lib/subjects'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface SidebarSection {
  id: string
  title: string
  icon: React.ReactNode
  subjects?: Array<{id: string, name: string}>
  classes?: string[]
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useUser()
  const { preferences, isProfileComplete } = useUserPreferences()
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  // Generate sidebar sections based on user preferences
  const getSidebarSections = (): SidebarSection[] => {
    const sections: SidebarSection[] = [
      {
        id: 'profile',
        title: 'Profile',
        icon: <User className="w-5 h-5" />
      }
    ]

    // Only show Questions and Books if profile is complete
    if (isProfileComplete()) {
      const userClass = preferences.currentClass
      const userStream = preferences.stream
      const subjects = getSubjectsByClass(userClass, userStream)
      
      sections.push(
        {
          id: 'questions',
          title: 'Questions',
          icon: <Brain className="w-5 h-5" />,
          subjects: subjects
        },
        {
          id: 'books',
          title: 'Books',
          icon: <BookOpen className="w-5 h-5" />,
          subjects: subjects
        }
      )
    }

    return sections
  }

  const sidebarSections = getSidebarSections()

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId)

  const getSubjectIcon = (subjectId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'mathematics': <span className="text-sm">📊</span>,
      'science': <span className="text-sm">🔬</span>,
      'physics': <span className="text-sm">⚛️</span>,
      'chemistry': <span className="text-sm">🧪</span>,
      'biology': <span className="text-sm">🧬</span>,
      'english': <span className="text-sm">📚</span>,
      'hindi': <span className="text-sm">📖</span>,
      'history': <span className="text-sm">🏛️</span>,
      'geography': <span className="text-sm">🌍</span>,
      'economics': <span className="text-sm">💰</span>,
      'political-science': <span className="text-sm">🏛️</span>,
      'social-science': <span className="text-sm">🌍</span>,
      'accountancy': <span className="text-sm">📊</span>,
      'business-studies': <span className="text-sm">💼</span>,
      'computer-science': <span className="text-sm">💻</span>,
      'informatics-practices': <span className="text-sm">💻</span>,
      'psychology': <span className="text-sm">🧠</span>,
      'sociology': <span className="text-sm">👥</span>
    }
    return iconMap[subjectId] || <BookOpen className="w-4 h-4" />
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          "w-80 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#2563eb" strokeWidth="2" fill="white" />
                  <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#2563eb" />
                  <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-gray-900 font-bold tracking-widest uppercase text-lg">ZapUp</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-white/50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>


        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-2">
            {/* Dynamic Sections */}
            {sidebarSections.map((section) => (
              <div key={section.id} className="space-y-1">
                {section.subjects && section.subjects.length > 0 ? (
                  // Expandable section with subjects
                  <>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {section.icon}
                        <span>{section.title}</span>
                      </div>
                      {isExpanded(section.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Subjects submenu */}
                    {isExpanded(section.id) && (
                      <div className="ml-8 space-y-1">
                        {section.subjects.map((subject) => (
                          <Link
                            key={subject.id}
                            href={`/${section.id}/${preferences.currentClass}/${subject.id}`}
                            className={cn(
                              "block px-3 py-2 rounded-lg text-sm transition-colors",
                              pathname === `/${section.id}/${preferences.currentClass}/${subject.id}`
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            <div className="flex items-center space-x-2">
                              {getSubjectIcon(subject.id)}
                              <span>{subject.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Simple link for Profile
                  <Link
                    href={`/${section.id}`}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === `/${section.id}`
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                  </Link>
                )}
              </div>
            ))}

            {/* Profile Completion Message */}
            {!isProfileComplete() && (
              <div className="px-3 mt-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-700">
                      <p className="font-medium mb-1">Complete your profile</p>
                      <p>Select your school board and class to access questions and books.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            href="/dashboard/pricing"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/dashboard/pricing"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <CreditCard className="w-5 h-5" />
            <span>Pricing Plans</span>
          </Link>
          
          <Link
            href="/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          
          <div className="px-3">
            <SignOutButton 
              variant="ghost" 
              className="w-full justify-start p-0 h-auto text-gray-700 hover:bg-transparent"
              showIcon={true}
            />
          </div>
        </div>
      </div>
    </>
  )
} 