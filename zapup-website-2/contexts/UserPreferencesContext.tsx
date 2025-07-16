// zapup-website-2/contexts/UserPreferencesContext.tsx
// Context for managing user academic preferences
// Stores school board, class, and stream selections in database

'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { userPreferencesService, UserPreferences as DBUserPreferences } from '@/lib/client-database'
import { SubscriptionType } from "@/lib/subscriptions";

export interface UserPreferences {
  schoolBoard: string
  currentClass: string
  stream?: string
  state?: string
  city?: string
  boardType?: string
  school?: string
  firstName?: string
  lastName?: string
  email?: string
  profilePictureUrl?: string
  isComplete: boolean
  subscriptionType: SubscriptionType;
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  isLoading: boolean
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>
  clearPreferences: () => Promise<void>
  isProfileComplete: () => boolean
  uploadProfilePicture: (file: File) => Promise<boolean>
  deleteProfilePicture: () => Promise<boolean>
}

const defaultPreferences: UserPreferences = {
  schoolBoard: '',
  currentClass: '',
  stream: '',
  state: '',
  city: '',
  boardType: '',
  school: '',
  firstName: '',
  lastName: '',
  email: '',
  profilePictureUrl: '',
  isComplete: false,
  subscriptionType: "explorer",
}

export const UserPreferencesContext = React.createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isLoaded } = useUser()

  const loadUserPreferences = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      console.log('Loading preferences for user:', user.id)
      
      const dbPreferences = await userPreferencesService.getUserPreferences()
      console.log('Database preferences:', dbPreferences)
      
      if (dbPreferences) {
        setPreferences(dbToContext(dbPreferences))
      } else {
        // Create initial preferences from Clerk data
        const initialPreferences = {
          ...defaultPreferences,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          profilePictureUrl: user.imageUrl || '',
          isComplete: false,
          subscriptionType: 'explorer' as SubscriptionType,
        };
        setPreferences(initialPreferences)
        
        console.log('Creating initial preferences:', initialPreferences)
        
        // Save to database
        await userPreferencesService.upsertUserPreferences({
          user_id: user.id,
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          profile_complete: false,
        } as any)
      }
    } catch (error) {
      console.error('Error loading user preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Load preferences from database when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      loadUserPreferences()
    } else if (isLoaded && !user) {
      setPreferences(defaultPreferences)
      setIsLoading(false)
    }
  }, [isLoaded, user, loadUserPreferences])

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return

    try {
      console.log('Updating preferences:', newPreferences)
      
      const updated = { ...preferences, ...newPreferences }
      
      // Check if profile is complete using same logic as isProfileComplete
      const isStreamRequired = updated.currentClass === '11' || updated.currentClass === '12'
      
      // New workflow complete check
      const newWorkflowComplete = !!(
        updated.state &&
        updated.city &&
        updated.boardType &&
        updated.school && 
        updated.currentClass && 
        (!isStreamRequired || updated.stream)
      )
      
      // Legacy workflow fallback
      const legacyWorkflowComplete = !!(
        updated.schoolBoard && 
        updated.currentClass && 
        (!isStreamRequired || updated.stream)
      )
      
      const isComplete = newWorkflowComplete || legacyWorkflowComplete
      
      updated.isComplete = isComplete

      // Prepare data for database - handle stream field properly
      const dbData = contextToDb(updated);

      // Only include stream if it's required and has a value
      if (isStreamRequired && updated.stream && updated.stream.trim() !== '') {
        dbData.stream = updated.stream as DBUserPreferences['stream']
      } else {
        // For classes 6-10 or when no stream is selected, remove stream field completely
        // This will keep it as NULL in the database
        delete dbData.stream
      }

      console.log('Database data to save:', dbData)

      // Update database
      const result = await userPreferencesService.upsertUserPreferences(dbData as any)

      console.log('Database update result:', result)

      if (result) {
        setPreferences(updated)
      } else {
        throw new Error('Failed to update preferences in database')
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  }

  const clearPreferences = async () => {
    if (!user) return

    try {
      const result = await userPreferencesService.clearPreferences()
      
      if (result) {
        const clearedPreferences = {
          ...defaultPreferences,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          profilePictureUrl: user.imageUrl || '',
          subscriptionType: 'explorer' as SubscriptionType,
        };
        setPreferences(clearedPreferences)
      }
    } catch (error) {
      console.error('Error clearing preferences:', error)
    }
  }

  const isProfileComplete = () => {
    const isStreamRequired = preferences.currentClass === '11' || preferences.currentClass === '12'
    
    // New workflow requires: state, city, boardType, school, currentClass (+ stream if 11/12)
    const newWorkflowComplete = !!(
      preferences.state &&
      preferences.city &&
      preferences.boardType &&
      preferences.school && 
      preferences.currentClass && 
      (!isStreamRequired || preferences.stream)
    )
    
    // Legacy workflow fallback: schoolBoard, currentClass (+ stream if 11/12)
    const legacyWorkflowComplete = !!(
      preferences.schoolBoard && 
      preferences.currentClass && 
      (!isStreamRequired || preferences.stream)
    )
    
    return newWorkflowComplete || legacyWorkflowComplete
  }

  const uploadProfilePicture = async (file: File): Promise<boolean> => {
    if (!user) return false

    try {
      const profilePictureUrl = await userPreferencesService.uploadProfilePicture(file)
      
      if (profilePictureUrl) {
        setPreferences(prev => ({
          ...prev,
          profilePictureUrl
        }))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      return false
    }
  }

  const deleteProfilePicture = async (): Promise<boolean> => {
    if (!user || !preferences.profilePictureUrl) return false

    try {
      const success = await userPreferencesService.deleteProfilePicture()
      
      if (success) {
        setPreferences(prev => ({
          ...prev,
          profilePictureUrl: user.imageUrl || ''
        }))
        return true
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error)
    }

    return false
  }

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      isLoading,
      updatePreferences,
      clearPreferences,
      isProfileComplete,
      uploadProfilePicture,
      deleteProfilePicture
    }}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider')
  }
  return context
} 

// When mapping from DB to context:
const dbToContext = (dbPreferences: any): UserPreferences => ({
  schoolBoard: dbPreferences.school_board || '',
  currentClass: dbPreferences.class_level || '',
  stream: dbPreferences.stream || '',
  state: dbPreferences.state || '',
  city: dbPreferences.city || '',
  boardType: dbPreferences.board_type || '',
  school: dbPreferences.school || '',
  firstName: dbPreferences.first_name || '',
  lastName: dbPreferences.last_name || '',
  email: dbPreferences.email || '',
  profilePictureUrl: dbPreferences.profile_picture_url || '',
  isComplete: dbPreferences.profile_complete || false,
  subscriptionType: (dbPreferences.subscription_type as SubscriptionType) || 'explorer',
});

// When mapping from context to DB:
const contextToDb = (prefs: UserPreferences) => {
  const isStreamRequired = prefs.currentClass === '11' || prefs.currentClass === '12'
  const profileComplete = !!(
    prefs.state &&
    prefs.city &&
    prefs.boardType &&
    prefs.school && 
    prefs.currentClass && 
    (!isStreamRequired || prefs.stream)
  )
  
  return {
    school_board: prefs.schoolBoard,
    class_level: prefs.currentClass,
    stream: prefs.stream,
    state: prefs.state,
    city: prefs.city,
    board_type: prefs.boardType,
    school: prefs.school,
    first_name: prefs.firstName,
    last_name: prefs.lastName,
    email: prefs.email,
    profile_picture_url: prefs.profilePictureUrl,
    profile_complete: profileComplete,
    subscription_type: prefs.subscriptionType,
  }
}; 