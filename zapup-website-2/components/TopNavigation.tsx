'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { User, BookOpen, Brain, Settings, LogOut, Calendar, Bell, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SignOutButton } from './SignOutButton'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TopNavigation() {
  const { user } = useUser()
  const { preferences } = useUserPreferences()
  const pathname = usePathname()

  const navigationItems = [
    {
      id: 'profile',
      title: 'Profile',
      href: '/profile',
      icon: <User className="w-4 h-4" />
    },
    {
      id: 'questions',
      title: 'Questions',
      href: '/questions',
      icon: <Brain className="w-4 h-4" />
    },
    {
      id: 'books',
      title: 'Books',
      href: '/books',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'pricing',
      title: 'Pricing',
      href: '/pricing',
      icon: <CreditCard className="w-4 h-4" />
    }
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="#2563eb" strokeWidth="2" fill="white" />
                <path d="M20 12L12 20L20 28L28 20L20 12Z" fill="#2563eb" />
                <path d="M20 16V24M16 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-blue-600 font-bold tracking-wider uppercase text-xl">ZAPUP</span>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname.startsWith(item.href)
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200">
              <Bell className="w-5 h-5" />
            </button>
            
            {/* Calendar */}
            <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200">
              <Calendar className="w-5 h-5" />
            </button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2 h-auto rounded-lg hover:bg-blue-50 transition-all duration-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {preferences.firstName || user?.firstName || 'Student'}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">Student</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-lg border-0">
                <DropdownMenuLabel className="text-gray-900">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center space-x-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center space-x-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <SignOutButton 
                    variant="ghost" 
                    className="w-full justify-start p-0 h-auto text-gray-700 hover:bg-transparent cursor-pointer"
                    showIcon={true}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-lg border-0">
                {navigationItems.map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link href={item.href} className="flex items-center space-x-2 cursor-pointer">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <SignOutButton 
                    variant="ghost" 
                    className="w-full justify-start p-0 h-auto text-gray-700 hover:bg-transparent cursor-pointer"
                    showIcon={true}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 