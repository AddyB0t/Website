// zapup-website-2/app/test-content-filter/page.tsx
// Test page for educational content filtering
// Demonstrates guardrails to prevent non-educational questions

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface TestResult {
  message: string
  isEducational: boolean
  status: 'ALLOWED' | 'BLOCKED'
  reason: string
}

export default function TestContentFilterPage() {
  const [testMessage, setTestMessage] = useState('')
  const [result, setResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testExamples = {
    educational: [
      "What is photosynthesis?",
      "How do I solve this math equation?",
      "Can you explain Newton's laws of motion?",
      "What is the capital of France?",
      "Help me understand fractions",
      "What does this English word mean?",
      "How do chemical reactions work?",
      "When did World War 2 end?",
      "What is the area of a triangle?",
      "How to write a good essay?"
    ],
    nonEducational: [
      "What's your favorite movie?",
      "Tell me about the latest Bollywood gossip",
      "Which mobile phone should I buy?",
      "What's happening in politics today?",
      "Do you like music?",
      "What's the best video game?",
      "Tell me about your girlfriend",
      "What should I wear to a party?",
      "How to get more Instagram followers?",
      "What's trending on YouTube?"
    ]
  }

  const testContentFilter = async (message: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-content-filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('Failed to test content filter')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Test error:', error)
      alert('Failed to test content filter')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTest = () => {
    if (!testMessage.trim()) return
    testContentFilter(testMessage)
  }

  const handleExampleTest = (message: string) => {
    setTestMessage(message)
    testContentFilter(message)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Content Filter Test
          </h1>
          <p className="text-gray-600">
            Test the educational content filtering system for the chatbot
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Test Input */}
          <Card>
            <CardHeader>
              <CardTitle>Test Your Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter a message to test:</label>
                <Input
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Type your message here..."
                  onKeyPress={(e) => e.key === 'Enter' && handleTest()}
                />
              </div>
              
              <Button 
                onClick={handleTest}
                disabled={!testMessage.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Message'}
              </Button>

              {result && (
                <div className="mt-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Result:</span>
                    <Badge 
                      variant={result.status === 'ALLOWED' ? 'default' : 'destructive'}
                    >
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Message:</strong> "{result.message}"
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Reason:</strong> {result.reason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Example Messages */}
          <div className="space-y-6">
            {/* Educational Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">✅ Educational Messages</CardTitle>
                <p className="text-sm text-gray-600">These should be ALLOWED</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testExamples.educational.map((message, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleTest(message)}
                      className="w-full text-left p-2 text-sm bg-green-50 hover:bg-green-100 rounded border text-green-800 transition-colors"
                    >
                      "{message}"
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Non-Educational Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">❌ Non-Educational Messages</CardTitle>
                <p className="text-sm text-gray-600">These should be BLOCKED</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testExamples.nonEducational.map((message, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleTest(message)}
                      className="w-full text-left p-2 text-sm bg-red-50 hover:bg-red-100 rounded border text-red-800 transition-colors"
                    >
                      "{message}"
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Explanation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How the Content Filter Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">✅ Educational Content (Allowed)</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Questions about academic subjects (Math, Science, English, History, etc.)</li>
                <li>• Learning-related queries with words like "explain", "how to", "what is"</li>
                <li>• Homework, assignment, and study-related questions</li>
                <li>• Concept explanations and problem-solving help</li>
                <li>• Short messages like greetings (under 10 characters)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-red-700 mb-2">❌ Non-Educational Content (Blocked)</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Entertainment topics (movies, music, games, social media)</li>
                <li>• Personal relationships and social questions</li>
                <li>• Current events, politics, and celebrity gossip</li>
                <li>• Shopping and technology purchasing advice</li>
                <li>• Inappropriate or harmful content</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This filtering applies to all subscription tiers, including Genius+ users, 
                to ensure the chatbot remains focused on educational assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 