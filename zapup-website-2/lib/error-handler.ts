// Universal Error Handler for ZapUp Website
// Provides consistent error handling across all classes and components

export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  USAGE_LIMIT = 'usage_limit',
  CONTENT_INAPPROPRIATE = 'content_inappropriate',
  AI_SERVICE = 'ai_service',
  DATABASE = 'database',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorDetails {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  userMessage: string
  technicalDetails?: string
  suggestedAction?: string
  classLevel?: string
  subject?: string
  retryable: boolean
}

export class UniversalError extends Error {
  public readonly details: ErrorDetails

  constructor(details: ErrorDetails) {
    super(details.message)
    this.name = 'UniversalError'
    this.details = details
  }
}

// Error classification helpers
export function classifyError(error: unknown): ErrorDetails {
  // Handle UniversalError instances
  if (error instanceof UniversalError) {
    return error.details
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return classifyStandardError(error)
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: error,
      userMessage: 'An unexpected error occurred. Please try again.',
      retryable: true
    }
  }

  // Handle unknown error types
  return {
    type: ErrorType.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    message: 'Unknown error occurred',
    userMessage: 'Something went wrong. Please refresh the page and try again.',
    retryable: true
  }
}

function classifyStandardError(error: Error): ErrorDetails {
  const message = error.message.toLowerCase()

  // Network errors
  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return {
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      userMessage: 'Network connection issue. Please check your internet and try again.',
      technicalDetails: error.message,
      retryable: true
    }
  }

  // Authentication errors
  if (message.includes('unauthorized') || message.includes('authentication') || message.includes('sign-in')) {
    return {
      type: ErrorType.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      message: error.message,
      userMessage: 'Please sign in to continue using ZapUp.',
      suggestedAction: 'Sign in to your account',
      retryable: false
    }
  }

  // Usage limit errors
  if (message.includes('limit') || message.includes('quota') || message.includes('usage')) {
    return {
      type: ErrorType.USAGE_LIMIT,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      userMessage: 'You\'ve reached your daily question limit. Upgrade to Scholar plan for unlimited questions!',
      suggestedAction: 'Upgrade your subscription',
      retryable: false
    }
  }

  // AI service errors
  if (message.includes('openrouter') || message.includes('ai') || message.includes('generate')) {
    return {
      type: ErrorType.AI_SERVICE,
      severity: ErrorSeverity.HIGH,
      message: error.message,
      userMessage: 'AI service is temporarily unavailable. Please try again in a few minutes.',
      technicalDetails: error.message,
      retryable: true
    }
  }

  // Database errors
  if (message.includes('database') || message.includes('supabase') || message.includes('sql')) {
    return {
      type: ErrorType.DATABASE,
      severity: ErrorSeverity.HIGH,
      message: error.message,
      userMessage: 'Unable to access questions right now. Please try again later.',
      technicalDetails: error.message,
      retryable: true
    }
  }

  // Default classification
  return {
    type: ErrorType.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    message: error.message,
    userMessage: 'An unexpected error occurred. Please try again.',
    technicalDetails: error.message,
    retryable: true
  }
}

// Class-specific error messages
export function getClassSpecificErrorMessage(
  error: ErrorDetails, 
  classLevel: string, 
  subject: string = 'mathematics'
): string {
  const classNum = parseInt(classLevel)
  const className = `Class ${classLevel}`

  switch (error.type) {
    case ErrorType.CONTENT_INAPPROPRIATE:
      if (classNum <= 8) {
        return `This question contains topics that are too advanced for ${className}. Please try questions that focus on ${getAppropriateTopicsForClass(classLevel)}.`
      } else if (classNum <= 10) {
        return `This content is typically covered in higher classes. For ${className}, try questions on ${getAppropriateTopicsForClass(classLevel)}.`
      }
      return error.userMessage

    case ErrorType.USAGE_LIMIT:
      return `You've used all your daily questions for ${className} ${subject}. Upgrade to Scholar plan for unlimited access to all subjects and classes!`

    case ErrorType.AI_SERVICE:
      if (classNum <= 8) {
        return `Our answer helper is taking a break! Try solving this ${className} question step-by-step, or ask your teacher for help.`
      }
      return `AI answer service is temporarily down. For ${className} questions, you can also check your textbook or consult with your teacher.`

    default:
      return error.userMessage
  }
}

function getAppropriateTopicsForClass(classLevel: string): string {
  const topics = {
    '6': 'whole numbers, fractions, basic geometry',
    '7': 'integers, simple equations, triangles',
    '8': 'rational numbers, linear equations, mensuration',
    '9': 'number systems, polynomials, coordinate geometry',
    '10': 'quadratic equations, trigonometry, circles',
    '11': 'functions, limits, derivatives',
    '12': 'calculus, matrices, vectors'
  }
  return topics[classLevel as keyof typeof topics] || 'age-appropriate topics'
}

// Logging helpers
export function logError(error: ErrorDetails, context?: { [key: string]: any }) {
  const logData = {
    timestamp: new Date().toISOString(),
    type: error.type,
    severity: error.severity,
    message: error.message,
    userMessage: error.userMessage,
    technicalDetails: error.technicalDetails,
    context,
    retryable: error.retryable
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ZapUp Error:', logData)
  }

  // In production, you might want to send to external logging service
  // Example: sendToLoggingService(logData)
}

// Error recovery suggestions
export function getRecoveryActions(error: ErrorDetails): string[] {
  const actions: string[] = []

  switch (error.type) {
    case ErrorType.NETWORK:
      actions.push('Check your internet connection')
      actions.push('Try refreshing the page')
      actions.push('Switch to a different network if available')
      break

    case ErrorType.AUTHENTICATION:
      actions.push('Sign in to your account')
      actions.push('Clear browser cache and cookies')
      actions.push('Try signing in from a different browser')
      break

    case ErrorType.USAGE_LIMIT:
      actions.push('Wait until tomorrow for limit reset')
      actions.push('Upgrade to Scholar plan for unlimited questions')
      actions.push('Try working on different subjects')
      break

    case ErrorType.CONTENT_INAPPROPRIATE:
      actions.push('Try questions from your current chapter')
      actions.push('Ask your teacher about this topic')
      actions.push('Focus on grade-appropriate content')
      break

    case ErrorType.AI_SERVICE:
      actions.push('Wait a few minutes and try again')
      actions.push('Try with a simpler question')
      actions.push('Use your textbook for reference')
      break

    case ErrorType.DATABASE:
      actions.push('Refresh the page')
      actions.push('Try again in a few minutes')
      actions.push('Contact support if problem persists')
      break

    default:
      actions.push('Refresh the page')
      actions.push('Try again')
      actions.push('Contact support if problem continues')
  }

  return actions
}

// User-friendly error component props
export interface ErrorComponentProps {
  error: unknown
  classLevel?: string
  subject?: string
  onRetry?: () => void
  showTechnicalDetails?: boolean
}

export function getErrorDisplayProps(props: ErrorComponentProps) {
  const { error, classLevel, subject } = props
  const errorDetails = classifyError(error)
  
  const userMessage = classLevel 
    ? getClassSpecificErrorMessage(errorDetails, classLevel, subject)
    : errorDetails.userMessage

  const recoveryActions = getRecoveryActions(errorDetails)
  
  return {
    severity: errorDetails.severity,
    message: userMessage,
    technicalDetails: errorDetails.technicalDetails,
    suggestedAction: errorDetails.suggestedAction,
    recoveryActions,
    retryable: errorDetails.retryable,
    showRetryButton: errorDetails.retryable && props.onRetry,
    iconType: getErrorIcon(errorDetails.type),
    colorScheme: getErrorColors(errorDetails.severity)
  }
}

function getErrorIcon(type: ErrorType): string {
  const icons = {
    [ErrorType.NETWORK]: 'wifi-off',
    [ErrorType.AUTHENTICATION]: 'user-x',
    [ErrorType.VALIDATION]: 'alert-triangle',
    [ErrorType.USAGE_LIMIT]: 'clock',
    [ErrorType.CONTENT_INAPPROPRIATE]: 'shield-alert',
    [ErrorType.AI_SERVICE]: 'brain-circuit',
    [ErrorType.DATABASE]: 'database-x',
    [ErrorType.UNKNOWN]: 'alert-circle'
  }
  return icons[type] || icons[ErrorType.UNKNOWN]
}

function getErrorColors(severity: ErrorSeverity): { bg: string, text: string, border: string } {
  const colors = {
    [ErrorSeverity.LOW]: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-800', 
      border: 'border-blue-200' 
    },
    [ErrorSeverity.MEDIUM]: { 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-800', 
      border: 'border-yellow-200' 
    },
    [ErrorSeverity.HIGH]: { 
      bg: 'bg-orange-50', 
      text: 'text-orange-800', 
      border: 'border-orange-200' 
    },
    [ErrorSeverity.CRITICAL]: { 
      bg: 'bg-red-50', 
      text: 'text-red-800', 
      border: 'border-red-200' 
    }
  }
  return colors[severity]
}