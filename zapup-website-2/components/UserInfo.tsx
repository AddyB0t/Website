// zapup-website-2/components/UserInfo.tsx
// User information display component using Clerk
// Shows current user data and authentication status

'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { SignOutButton } from './SignOutButton'
import Link from 'next/link'

export function UserInfo() {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/sign-in">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {user?.imageUrl && (
          <img 
            src={user.imageUrl} 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm text-gray-700">
          {user?.firstName || user?.emailAddresses[0]?.emailAddress}
        </span>
      </div>
      <SignOutButton />
    </div>
  )
} 