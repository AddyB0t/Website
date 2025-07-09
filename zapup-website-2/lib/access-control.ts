import { SUBSCRIPTION_FEATURES, SubscriptionType } from './subscriptions'

export interface UserPreferences {
  currentClass: string
  subscriptionType: SubscriptionType
}

/**
 * Check if a user can access a specific class based on their subscription type
 * @param targetClass - The class the user is trying to access
 * @param userPreferences - User's current preferences including subscription type and current class
 * @returns boolean indicating if access is allowed
 */
export function canAccessClass(targetClass: string, userPreferences: UserPreferences): boolean {
  const { currentClass, subscriptionType } = userPreferences
  const features = SUBSCRIPTION_FEATURES[subscriptionType]

  // Check if the class is in the allowed classes for this subscription
  if (!features.allowedClasses.includes(targetClass)) {
    return false
  }

  // For Scholar mode (maxClassesSelectable: 1), user can only access their currently selected class
  if (features.maxClassesSelectable === 1) {
    return targetClass === currentClass
  }

  // For other subscription types with multiple class access, allow access to any allowed class
  return true
}

/**
 * Get the redirect URL for a user who doesn't have access to a specific class
 * @param userPreferences - User's current preferences
 * @returns The URL to redirect the user to
 */
export function getClassAccessRedirectUrl(userPreferences: UserPreferences): string {
  const { currentClass } = userPreferences
  
  // Always redirect to the user's currently selected class
  return `/questions/${currentClass}`
}

/**
 * Check if a user can access multiple classes simultaneously
 * @param subscriptionType - User's subscription type
 * @returns boolean indicating if multi-class access is allowed
 */
export function canAccessMultipleClasses(subscriptionType: SubscriptionType): boolean {
  const features = SUBSCRIPTION_FEATURES[subscriptionType]
  return features.maxClassesSelectable > 1
} 