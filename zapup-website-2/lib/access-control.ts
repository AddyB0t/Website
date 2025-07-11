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
 * Get all classes that a user can access based on their subscription
 * @param subscriptionType - User's subscription type
 * @returns Array of accessible class IDs
 */
export function getAccessibleClasses(subscriptionType: SubscriptionType): string[] {
  const features = SUBSCRIPTION_FEATURES[subscriptionType]
  return features.allowedClasses
}

/**
 * Filter classes array to only show accessible ones
 * @param allClasses - Array of all available classes
 * @param subscriptionType - User's subscription type
 * @param currentClass - User's currently selected class (for Scholar plan)
 * @returns Filtered array with access information
 */
export function filterClassesByAccess(
  allClasses: Array<{id: string, name: string, [key: string]: any}>,
  subscriptionType: SubscriptionType,
  currentClass?: string
): Array<{id: string, name: string, accessible: boolean, requiresUpgrade: boolean, [key: string]: any}> {
  const features = SUBSCRIPTION_FEATURES[subscriptionType]
  
  return allClasses.map(classItem => {
    const isInAllowedClasses = features.allowedClasses.includes(classItem.id)
    let accessible = false
    let requiresUpgrade = false
    
    if (isInAllowedClasses) {
      // For Scholar plan, only current class is accessible
      if (features.maxClassesSelectable === 1) {
        accessible = classItem.id === currentClass
        requiresUpgrade = classItem.id !== currentClass
      } else {
        accessible = true
      }
    } else {
      requiresUpgrade = true
    }
    
    return {
      ...classItem,
      accessible,
      requiresUpgrade
    }
  })
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

/**
 * Get upgrade message for a specific class
 * @param classId - The class ID
 * @param subscriptionType - Current subscription type
 * @returns Upgrade message object
 */
export function getUpgradeMessage(classId: string, subscriptionType: SubscriptionType): {
  title: string
  description: string
  requiredPlan: string
} {
  const features = SUBSCRIPTION_FEATURES[subscriptionType]
  
  // Check what plan is needed for this class
  if (!features.allowedClasses.includes(classId)) {
    // Class not in allowed classes - need higher plan
    if (subscriptionType === 'explorer') {
      return {
        title: 'Upgrade to Scholar Plan',
        description: `Access to Class ${classId} requires a Scholar plan or higher. Upgrade to unlock all classes!`,
        requiredPlan: 'scholar'
      }
    }
  }
  
  // For Scholar plan with single class restriction
  if (features.maxClassesSelectable === 1) {
    return {
      title: 'Upgrade to Achiever Plan',
      description: `Access multiple classes simultaneously with an Achiever plan. Currently you can only access your selected class.`,
      requiredPlan: 'achiever'
    }
  }
  
  return {
    title: 'Upgrade Required',
    description: 'Upgrade your plan to access this content.',
    requiredPlan: 'scholar'
  }
}

/**
 * Get subscription display info
 * @param subscriptionType - User's subscription type
 * @returns Display information for the subscription
 */
export function getSubscriptionDisplayInfo(subscriptionType: SubscriptionType): {
  name: string
  badge: string
  color: string
} {
  const displayMap = {
    explorer: { name: 'Explorer', badge: 'Free', color: 'gray' },
    scholar: { name: 'Scholar', badge: 'Basic', color: 'blue' },
    achiever: { name: 'Achiever', badge: 'Plus', color: 'green' },
    genius_plus: { name: 'Genius+', badge: 'Premium', color: 'purple' }
  }
  
  return displayMap[subscriptionType] || displayMap.explorer
} 