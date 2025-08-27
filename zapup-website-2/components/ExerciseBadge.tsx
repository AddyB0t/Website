'use client'

import { Badge } from '@/components/ui/badge'
import { BookOpen, Hash, FileText, Calculator } from 'lucide-react'

interface ExerciseBadgeProps {
  exerciseName?: string | null
  exerciseNumber?: string | null
  variant?: 'default' | 'secondary' | 'outline' | 'inline'
  showIcon?: boolean
  className?: string
}

export function ExerciseBadge({ 
  exerciseName, 
  exerciseNumber, 
  variant = 'default',
  showIcon = true,
  className = ''
}: ExerciseBadgeProps) {
  // Don't render if no exercise information
  if (!exerciseName && !exerciseNumber) {
    return null
  }

  // Determine display text and icon
  let displayText = ''
  let IconComponent = BookOpen
  
  if (exerciseName && exerciseNumber) {
    displayText = `${exerciseName} ${exerciseNumber}`
  } else if (exerciseName) {
    displayText = exerciseName
  } else if (exerciseNumber) {
    displayText = `Exercise ${exerciseNumber}`
    IconComponent = Hash
  }

  // Determine icon based on exercise type
  if (exerciseName) {
    const lowerName = exerciseName.toLowerCase()
    if (lowerName.includes('practice') || lowerName.includes('drill')) {
      IconComponent = Calculator
    } else if (lowerName.includes('test') || lowerName.includes('exam')) {
      IconComponent = FileText
    } else if (lowerName.includes('exercise')) {
      IconComponent = Hash
    }
  }

  // Inline variant for text flow
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center text-sm text-gray-500 ${className}`}>
        {showIcon && <IconComponent className="inline w-4 h-4 mr-1" />}
        {displayText}
      </span>
    )
  }

  // Badge variants
  return (
    <Badge variant={variant} className={`text-xs ${className}`}>
      {showIcon && <IconComponent className="w-3 h-3 mr-1" />}
      {displayText}
    </Badge>
  )
}

// Utility function to format exercise display consistently
export function getExerciseDisplayText(
  exerciseName?: string | null, 
  exerciseNumber?: string | null
): string {
  if (exerciseName && exerciseNumber) {
    return `${exerciseName} ${exerciseNumber}`
  } else if (exerciseName) {
    return exerciseName
  } else if (exerciseNumber) {
    return `Exercise ${exerciseNumber}`
  }
  return ''
}

// Helper to determine if exercise information is available
export function hasExerciseInfo(
  exerciseName?: string | null, 
  exerciseNumber?: string | null
): boolean {
  return Boolean(exerciseName || exerciseNumber)
}