// zapup-website-2/app/books/page.tsx
// Redirect to My Images page (Books feature has been replaced)

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BooksRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to My Images page
    router.replace('/my-images')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to My Images...</p>
    </div>
  )
}
