// zapup-website-2/components/QuestionUsageDisplay.tsx
// Component to display daily question usage limits
// Shows remaining questions for explorer plan users

'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Zap, Crown } from 'lucide-react'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions'

interface UsageData {
  current_usage: number
  max_allowed: number
  remaining: number
  can_ask: boolean
  unlimited?: boolean
}

interface QuestionUsageDisplayProps {
  subjectId?: string
  classId?: string
  showInChatbot?: boolean
}

export function QuestionUsageDisplay({ 
  subjectId = 'mathematics', 
  classId = '7',
  showInChatbot = false 
}: QuestionUsageDisplayProps) {
  const { preferences } = useUserPreferences()
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  const subscriptionFeatures = SUBSCRIPTION_FEATURES[preferences.subscriptionType]
  const isExplorer = preferences.subscriptionType === 'explorer'

  const fetchUsage = async () => {
    if (!isExplorer) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/question-usage?subject=${subjectId}&class=${classId}&t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        setUsage(data)
      } else {
        console.error('API error:', response.status, response.statusText)
        // Set default usage for now
        setUsage({
          current_usage: 0,
          max_allowed: 5,
          remaining: 5,
          can_ask: true
        })
      }
    } catch (error) {
      console.error('Error fetching usage data:', error)
      // Set default usage for now
      setUsage({
        current_usage: 0,
        max_allowed: 5,
        remaining: 5,
        can_ask: true
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsage()
  }, [subjectId, classId, isExplorer])

  // Refresh usage every 5 seconds when chatbot is open
  useEffect(() => {
    if (!showInChatbot || !isExplorer) return

    const interval = setInterval(() => {
      fetchUsage()
    }, 5000)

    return () => clearInterval(interval)
  }, [showInChatbot, isExplorer, subjectId, classId])

  // Listen for question asked events
  useEffect(() => {
    const handleQuestionAsked = () => {
      console.log('Question asked event received, refreshing usage...')
      setTimeout(() => {
        fetchUsage()
      }, 1000) // Wait 1 second then refresh
    }

    // Listen for custom events
    window.addEventListener('questionAsked', handleQuestionAsked)
    
    return () => {
      window.removeEventListener('questionAsked', handleQuestionAsked)
    }
  }, [])

  // Expose refresh function globally for chatbot
  useEffect(() => {
    (window as any).refreshQuestionUsage = fetchUsage
  }, [])

  // Only show for Explorer plan users (limited questions)
  if (preferences.subscriptionType !== 'explorer' || subscriptionFeatures.maxQuestionsPerDay === Infinity) {
    return null
  }

  if (loading) {
    return (
      <div className={`${showInChatbot ? 'px-4 py-2' : 'p-4'} bg-gray-50 rounded-lg`}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!usage) {
    return null
  }

  const progressPercentage = (usage.current_usage / usage.max_allowed) * 100
  const isNearLimit = usage.remaining <= 1
  const isAtLimit = usage.remaining === 0

  return (
    <div className={`${showInChatbot ? 'px-4 py-3 border-b' : 'p-4'} bg-gradient-to-r from-blue-50 to-indigo-50 ${showInChatbot ? '' : 'rounded-lg border'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">Daily Questions</span>
        </div>
        <Badge 
          variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "default"}
          className={`text-xs ${
            isAtLimit 
              ? 'bg-red-100 text-red-800' 
              : isNearLimit 
                ? 'bg-orange-100 text-orange-800'
                : 'bg-blue-100 text-blue-800'
          }`}
        >
          {usage.remaining} left
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{usage.current_usage} used</span>
          <span>{usage.max_allowed} total</span>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className={`h-2 ${
            isAtLimit 
              ? '[&>div]:bg-red-500' 
              : isNearLimit 
                ? '[&>div]:bg-orange-500'
                : '[&>div]:bg-blue-500'
          }`}
        />

        {isAtLimit && (
          <div className="flex items-center justify-between mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-800 font-medium">Limit reached for today</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-purple-700 font-medium cursor-pointer hover:text-purple-800">
              <Crown className="w-3 h-3" />
              <span>Upgrade</span>
            </div>
          </div>
        )}

        {isNearLimit && !isAtLimit && (
          <div className="flex items-center justify-between mt-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
            <span className="text-xs text-orange-800">Almost at daily limit</span>
            <div className="flex items-center space-x-1 text-xs text-purple-700 font-medium cursor-pointer hover:text-purple-800">
              <Crown className="w-3 h-3" />
              <span>Upgrade</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 