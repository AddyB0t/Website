// zapup-website-2/app/books/page.tsx
// Index page for books - redirects to user's class-specific books

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Loader2 } from 'lucide-react'

export default function BooksIndexPage() {
  const { preferences, isProfileComplete, isLoading } = useUserPreferences()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isProfileComplete()) {
        // Redirect to profile if not complete
        router.push('/profile')
      } else if (preferences.currentClass) {
        // Redirect to user's class-specific books
        router.push(`/books/${preferences.currentClass}`)
      }
    }
  }, [isLoading, isProfileComplete, preferences.currentClass, router])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Books</h3>
              <p className="text-gray-600">Please wait while we prepare your books...</p>
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
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Redirecting to Books</h3>
            <p className="text-gray-600">Taking you to your class-specific books...</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
} 