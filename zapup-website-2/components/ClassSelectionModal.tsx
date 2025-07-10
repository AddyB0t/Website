'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, BookOpen, Users, Brain } from 'lucide-react'

interface ClassSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClassSelect: (classId: string) => void
}

export function ClassSelectionModal({ open, onOpenChange, onClassSelect }: ClassSelectionModalProps) {
  const [selectedClass, setSelectedClass] = useState('')

  const classOptions = [
    {
      id: '6',
      title: 'Class 6',
      description: 'Primary to Middle School Transition',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '7',
      title: 'Class 7',
      description: 'Building Strong Foundations',
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '8',
      title: 'Class 8',
      description: 'Expanding Knowledge Horizons',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '9',
      title: 'Class 9',
      description: 'Preparing for Board Exams',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '10',
      title: 'Class 10',
      description: 'Board Exam Preparation',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-red-500 to-rose-500',
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English']
    },
    {
      id: '11',
      title: 'Class 11',
      description: 'Stream Specialization',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      subjects: ['Science', 'Commerce', 'Humanities']
    },
    {
      id: '12',
      title: 'Class 12',
      description: 'Final Board Examinations',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-violet-500 to-fuchsia-500',
      subjects: ['Science', 'Commerce', 'Humanities']
    }
  ]

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId)
  }

  const handleContinue = () => {
    if (selectedClass) {
      onClassSelect(selectedClass)
      onOpenChange(false)
      setSelectedClass('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Class to Preview
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Select the class you want to explore and see available subjects
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classOptions.map((classOption) => (
              <Card 
                key={classOption.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedClass === classOption.id 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : ''
                }`}
                onClick={() => handleClassSelect(classOption.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${classOption.color} flex items-center justify-center text-white mb-3`}>
                      {classOption.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {classOption.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {classOption.description}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {classOption.subjects.map((subject, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!selectedClass}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              Continue to Subjects
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 