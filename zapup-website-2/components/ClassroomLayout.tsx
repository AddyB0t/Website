'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, BookOpen, Target } from 'lucide-react'
import Link from 'next/link'

interface Subject {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  color: string
  bgColor: string
  available?: boolean
  topics?: number | string[]
}

interface ClassroomLayoutProps {
  title: React.ReactNode
  description: string
  subjects: Subject[]
  className?: string
  additionalSections?: React.ReactNode
}

export function ClassroomLayout({ 
  title, 
  description, 
  subjects, 
  className = '',
  additionalSections
}: ClassroomLayoutProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {subjects.map((subject) => (
          <Card key={subject.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-200 shadow-lg overflow-hidden bg-white">
            {/* Card Header */}
            <CardHeader className="bg-white border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
                    <div className="text-blue-600">
                      {subject.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                      {subject.name}
                    </CardTitle>
                    {subject.available !== undefined && (
                      <Badge 
                        variant={subject.available ? "default" : "secondary"}
                        className={`
                          ${subject.available 
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-0" 
                            : "bg-gray-100 text-gray-600 border-0"
                          }
                        `}
                      >
                        {subject.available ? "Available" : "Coming Soon"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="p-6 bg-white">
              <p className="text-gray-600 mb-6 leading-relaxed">{subject.description}</p>
              
              {/* Topics or Stats */}
              {subject.topics && (
                <div className="flex items-center space-x-2 mb-6">
                  {typeof subject.topics === 'number' ? (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <BookOpen className="w-4 h-4" />
                      <span>{subject.topics} Topics</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Target className="w-4 h-4" />
                      <span>{subject.topics.length} Chapters</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end">
                {subject.available === false ? (
                  <Button 
                    variant="outline"
                    disabled={true}
                    className="border-gray-200 text-gray-400 cursor-not-allowed bg-white"
                  >
                    <span>Coming Soon</span>
                  </Button>
                ) : (
                  <Button 
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg group/btn transition-all duration-200"
                  >
                    <Link href={`/classroom/${subject.id}`} className="flex items-center">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Sections */}
      {additionalSections}
    </div>
  )
}

// Learning Resources Section Component
interface LearningResourcesProps {
  title: string
  resources: {
    title: string
    items: string[]
  }[]
}

export function LearningResourcesSection({ title, resources }: LearningResourcesProps) {
  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader className="bg-gray-50 border-b border-gray-100 p-6">
        <CardTitle className="text-xl font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((resource, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">{resource.title}</h3>
              <ul className="space-y-3">
                {resource.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3 text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 