// zapup-website-2/components/AppLayout.tsx
// Main app layout with sidebar for authenticated users
// Manages sidebar state and provides responsive layout

'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Sidebar } from './Sidebar'
import { SidebarToggle } from './SidebarToggle'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const { isSignedIn, isLoaded } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [])

  // Don't show sidebar if user is not signed in
  if (!isLoaded || !isSignedIn || !showSidebar) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header with sidebar toggle */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <SidebarToggle onClick={() => setSidebarOpen(true)} />
            <h1 className="text-lg font-medium text-gray-900">ZapUp</h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 