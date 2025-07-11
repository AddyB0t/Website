'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions'

export default function CheckSubscriptionPage() {
  const { preferences, updatePreferences } = useUserPreferences()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const subscriptionFeatures = SUBSCRIPTION_FEATURES[preferences.subscriptionType]

  const updateSubscription = async (newSubscriptionType: string) => {
    setLoading(true)
    setMessage('')

    try {
      await updatePreferences({
        subscriptionType: newSubscriptionType as any
      })
      setMessage(`✅ Updated to ${newSubscriptionType} plan!`)
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status & Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Subscription */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
            <Badge className="text-lg p-2">
              {preferences.subscriptionType} Plan
            </Badge>
          </div>

          {/* Features Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Daily Questions</span>
                  <span className="font-medium">
                    {subscriptionFeatures.maxQuestionsPerDay === Infinity 
                      ? 'Unlimited' 
                      : subscriptionFeatures.maxQuestionsPerDay}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Chatbot Mode</span>
                  <span className="font-medium">{subscriptionFeatures.chatbotMode}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Image Upload</span>
                  <span className="font-medium">
                    {subscriptionFeatures.imageUpload ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Progress Tracking</span>
                  <span className="font-medium">
                    {subscriptionFeatures.progressTracking ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Exam Mode</span>
                  <span className="font-medium">
                    {subscriptionFeatures.examMode ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Audio Explanations</span>
                  <span className="font-medium">
                    {subscriptionFeatures.audioExplanations ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Mock Tests</span>
                  <span className="font-medium">
                    {subscriptionFeatures.mockTests ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Allowed Classes</span>
                  <span className="font-medium">
                    {subscriptionFeatures.allowedClasses.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Switch Buttons */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Test Different Plans</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => updateSubscription('explorer')}
                disabled={loading}
                variant={preferences.subscriptionType === 'explorer' ? 'default' : 'outline'}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Explorer (Free)
              </Button>
              <Button
                onClick={() => updateSubscription('scholar')}
                disabled={loading}
                variant={preferences.subscriptionType === 'scholar' ? 'default' : 'outline'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Scholar (Basic)
              </Button>
              <Button
                onClick={() => updateSubscription('achiever')}
                disabled={loading}
                variant={preferences.subscriptionType === 'achiever' ? 'default' : 'outline'}
                className="bg-green-600 hover:bg-green-700"
              >
                Achiever (Plus)
              </Button>
              <Button
                onClick={() => updateSubscription('genius_plus')}
                disabled={loading}
                variant={preferences.subscriptionType === 'genius_plus' ? 'default' : 'outline'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Genius+ (Premium)
              </Button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">How to Test:</h4>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>1. Switch to <strong>Achiever</strong> or <strong>Genius+</strong> to see photo upload</li>
              <li>2. Switch to <strong>Explorer</strong> to see daily limits (5 questions)</li>
              <li>3. Switch to <strong>Scholar+</strong> to see unlimited questions</li>
              <li>4. Go back to the chatbot to see the changes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 