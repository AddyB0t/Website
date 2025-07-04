// zapup-website-2/app/questions/page.tsx
// Index page for questions - redirects to user's class-specific questions

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, Loader2 } from 'lucide-react'

export default function QuestionsIndexPage() {
  const { preferences } = useUserPreferences()
  const router = useRouter()

  useEffect(() => {
    if (preferences.currentClass) {
      // Redirect to user's class-specific questions
      router.push(`/questions/${preferences.currentClass}`)
    }
  }, [preferences.currentClass, router])

  if (!preferences.currentClass) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Questions</h3>
              <p className="text-gray-600">Please wait while we prepare your questions...</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Redirecting to Questions</h3>
            <p className="text-gray-600">Taking you to your class-specific questions...</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
} 