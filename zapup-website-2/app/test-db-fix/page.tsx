'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestDbFixPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fixDatabase = async () => {
    setLoading(true)
    setResults(['Starting database fix...'])

    try {
      const response = await fetch('/api/fix-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (data.success) {
        setResults(['✅ Database fix completed!', ...data.results])
      } else {
        setResults(['❌ Database fix failed:', data.error, ...data.results])
      }
    } catch (error) {
      setResults(['❌ Error:', error instanceof Error ? error.message : 'Unknown error'])
    } finally {
      setLoading(false)
    }
  }

  const testQuestionUsage = async () => {
    setLoading(true)
    setResults(['Testing question usage API...'])

    try {
      // Test GET
      const getResponse = await fetch('/api/question-usage?subject=mathematics&class=7')
      const getData = await getResponse.json()
      setResults(prev => [...prev, '📊 GET Result:', JSON.stringify(getData, null, 2)])

      // Test POST
      const postResponse = await fetch('/api/question-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: 'mathematics',
          classId: '7'
        })
      })
      const postData = await postResponse.json()
      setResults(prev => [...prev, '📝 POST Result:', JSON.stringify(postData, null, 2)])

    } catch (error) {
      setResults(prev => [...prev, '❌ Test Error:', error instanceof Error ? error.message : 'Unknown error'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Database Fix Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={fixDatabase} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Fixing...' : 'Fix Database'}
            </Button>
            
            <Button 
              onClick={testQuestionUsage} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Usage API'}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Results:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {results.join('\n')}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 