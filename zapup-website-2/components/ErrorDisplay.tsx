'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertCircle, 
  WifiOff, 
  UserX, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Brain, 
  DatabaseX,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { ErrorComponentProps, getErrorDisplayProps } from '@/lib/error-handler'

interface ErrorDisplayProps extends ErrorComponentProps {
  compact?: boolean
  showRecoveryActions?: boolean
  className?: string
}

export function ErrorDisplay({ 
  error, 
  classLevel, 
  subject, 
  onRetry, 
  showTechnicalDetails = false,
  compact = false,
  showRecoveryActions = true,
  className = ''
}: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = React.useState(false)
  const [showActions, setShowActions] = React.useState(false)
  
  const props = getErrorDisplayProps({
    error,
    classLevel,
    subject,
    onRetry,
    showTechnicalDetails
  })

  const IconComponent = getIconComponent(props.iconType)

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-sm ${props.colorScheme.text} ${className}`}>
        <IconComponent className="w-4 h-4" />
        <span>{props.message}</span>
        {props.showRetryButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRetry}
            className="h-6 px-2 ml-2"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className={`${props.colorScheme.border} ${className}`}>
      <CardContent className={`p-4 ${props.colorScheme.bg}`}>
        <div className="space-y-3">
          {/* Main error message */}
          <div className="flex items-start gap-3">
            <IconComponent className={`w-5 h-5 mt-0.5 ${props.colorScheme.text}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className={`font-medium ${props.colorScheme.text}`}>
                  {props.message}
                </p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${props.colorScheme.text} ${props.colorScheme.border}`}
                >
                  {props.severity}
                </Badge>
              </div>
              
              {props.suggestedAction && (
                <p className={`text-sm ${props.colorScheme.text} opacity-80`}>
                  {props.suggestedAction}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {props.showRetryButton && (
              <Button
                onClick={onRetry}
                size="sm"
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            
            {showRecoveryActions && props.recoveryActions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className={`${props.colorScheme.text} hover:bg-white/50`}
              >
                Help & Tips
                {showActions ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </Button>
            )}

            {showTechnicalDetails && props.technicalDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className={`${props.colorScheme.text} hover:bg-white/50`}
              >
                Technical Details
                {showDetails ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </Button>
            )}
          </div>

          {/* Recovery actions */}
          {showActions && props.recoveryActions.length > 0 && (
            <div className="mt-3 p-3 bg-white/70 rounded-md">
              <h4 className={`text-sm font-medium ${props.colorScheme.text} mb-2`}>
                What you can try:
              </h4>
              <ul className={`text-sm ${props.colorScheme.text} space-y-1`}>
                {props.recoveryActions.map((action, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-current rounded-full" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical details */}
          {showDetails && props.technicalDetails && (
            <div className="mt-3 p-3 bg-white/70 rounded-md">
              <h4 className={`text-sm font-medium ${props.colorScheme.text} mb-2`}>
                Technical Information:
              </h4>
              <code className={`text-xs ${props.colorScheme.text} opacity-70 font-mono`}>
                {props.technicalDetails}
              </code>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Specialized error displays for common scenarios
export function NetworkErrorDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error={new Error('Network connection failed')}
      onRetry={onRetry}
      showRecoveryActions={true}
    />
  )
}

export function AuthErrorDisplay({ classLevel }: { classLevel?: string }) {
  return (
    <ErrorDisplay
      error={new Error('Authentication required')}
      classLevel={classLevel}
      showRecoveryActions={true}
    />
  )
}

export function UsageLimitErrorDisplay({ 
  classLevel, 
  subject 
}: { 
  classLevel: string
  subject: string 
}) {
  return (
    <ErrorDisplay
      error={new Error('Usage limit reached')}
      classLevel={classLevel}
      subject={subject}
      showRecoveryActions={true}
    />
  )
}

export function ContentInappropriateErrorDisplay({ 
  classLevel, 
  subject,
  details 
}: { 
  classLevel: string
  subject: string
  details: string
}) {
  return (
    <ErrorDisplay
      error={new Error(`Inappropriate content: ${details}`)}
      classLevel={classLevel}
      subject={subject}
      showRecoveryActions={true}
    />
  )
}

export function AIServiceErrorDisplay({ 
  classLevel, 
  onRetry 
}: { 
  classLevel?: string
  onRetry?: () => void 
}) {
  return (
    <ErrorDisplay
      error={new Error('AI service temporarily unavailable')}
      classLevel={classLevel}
      onRetry={onRetry}
      showRecoveryActions={true}
    />
  )
}

// Helper function to get icon component
function getIconComponent(iconType: string): React.ComponentType<{ className?: string }> {
  const iconMap = {
    'wifi-off': WifiOff,
    'user-x': UserX,
    'alert-triangle': AlertTriangle,
    'clock': Clock,
    'shield-alert': ShieldAlert,
    'brain-circuit': Brain,
    'database-x': DatabaseX,
    'alert-circle': AlertCircle
  }
  
  return iconMap[iconType as keyof typeof iconMap] || AlertCircle
}

// Hook for error handling in components
export function useErrorHandler(classLevel?: string, subject?: string) {
  const [error, setError] = React.useState<unknown>(null)
  const [isRetrying, setIsRetrying] = React.useState(false)

  const handleError = React.useCallback((err: unknown) => {
    console.error('Error handled:', err)
    setError(err)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
    setIsRetrying(false)
  }, [])

  const retry = React.useCallback(async (retryFn: () => Promise<void>) => {
    setIsRetrying(true)
    try {
      await retryFn()
      clearError()
    } catch (err) {
      handleError(err)
    } finally {
      setIsRetrying(false)
    }
  }, [handleError, clearError])

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retry,
    ErrorComponent: React.useCallback(
      (props: Omit<ErrorDisplayProps, 'error'>) => 
        error ? (
          <ErrorDisplay 
            {...props} 
            error={error} 
            classLevel={classLevel} 
            subject={subject} 
          />
        ) : null,
      [error, classLevel, subject]
    )
  }
}