// zapup-website-2/components/AppLayout.tsx
// Main app layout with top navigation for authenticated users
// Replaces sidebar with top navigation bar

'use client'

import React from 'react'
import { useAuth } from '@clerk/nextjs'
import { TopNavigation } from './TopNavigation'

interface AppLayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
}

export function AppLayout({ children, showNavigation = true }: AppLayoutProps) {
  const { isSignedIn, isLoaded } = useAuth()

  // Don't show navigation if user is not signed in
  if (!isLoaded || !isSignedIn || !showNavigation) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Main content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  )
} 