// zapup-website-2/app/debug-subscription/page.tsx
// Debug page to diagnose subscription update issues
// Shows current state and allows manual refresh

'use client'

import { useState, useEffect } from 'react'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Database, User, AlertTriangle, CheckCircle } from 'lucide-react'
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions'

export default function DebugSubscriptionPage() {
  const { preferences, refreshPreferences, isLoading } = useUserPreferences()
  const [refreshing, setRefreshing] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const getPlanName = (subscriptionType: string) => {
    switch (subscriptionType) {
      case 'explorer': return 'Explorer'
      case 'scholar': return 'Scholar'
      case 'achiever': return 'Achiever'
      case 'genius_plus': return 'Genius+'
      default: return 'Unknown'
    }
  }

  const fetchDebugInfo = async () => {
    try {
      // Fetch raw data from API
      const response = await fetch('/api/user-preferences')
      const data = await response.json()
      
      setDebugInfo({
        apiResponse: data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        localStorage: typeof window !== 'undefined' ? {
          hasUserPreferences: !!localStorage.getItem('user_preferences'),
          keys: Object.keys(localStorage)
        } : null
      })
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshPreferences()
      await fetchDebugInfo()
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error refreshing:', error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Debug</h1>
          <p className="text-gray-600">
            Debug information for subscription status and updates
          </p>
        </div>

        {/* Current State */}
        <Card className="mb-6 bg-white border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <User className="w-5 h-5 text-blue-600" />
              <span>Current Context State</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700 font-medium">Subscription Type:</span>
                  <Badge className="ml-2 bg-blue-100 text-blue-800 border border-blue-300">{preferences.subscriptionType}</Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700 font-medium">Plan Name:</span>
                  <Badge className="ml-2 bg-green-100 text-green-800 border border-green-300">{getPlanName(preferences.subscriptionType)}</Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700 font-medium">Loading State:</span>
                  <Badge variant={isLoading ? "destructive" : "default"} className="ml-2">
                    {isLoading ? 'Loading' : 'Ready'}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700 font-medium">Last Refresh:</span>
                  <span className="ml-2 text-sm text-gray-600 font-mono">
                    {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Response */}
        <Card className="mb-6 bg-white border-2 border-green-200 shadow-lg">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="flex items-center space-x-2 text-green-900">
              <Database className="w-5 h-5 text-green-600" />
              <span>Database Response</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700 font-medium">API Status:</span>
                <Badge variant={debugInfo.apiResponse?.success ? "default" : "destructive"} className="text-sm">
                  {debugInfo.apiResponse?.success ? 'Success' : 'Error'}
                </Badge>
              </div>
              
              {debugInfo.apiResponse?.data && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium mb-3 text-gray-800">Raw Database Data:</h4>
                  <pre className="text-xs overflow-auto bg-white p-3 rounded border border-gray-300 text-gray-800 font-mono">
                    {JSON.stringify(debugInfo.apiResponse.data, null, 2)}
                  </pre>
                </div>
              )}

              {debugInfo.error && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">Error:</h4>
                  <p className="text-red-700 text-sm">{debugInfo.error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="mb-6 bg-white border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-purple-50 border-b border-purple-200">
            <CardTitle className="flex items-center space-x-2 text-purple-900">
              <RefreshCw className="w-5 h-5 text-purple-600" />
              <span>Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button 
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Force Refresh Subscription Data'}
              </Button>

              <Button 
                onClick={fetchDebugInfo}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3"
              >
                <Database className="w-4 h-4 mr-2" />
                Refresh Debug Info
              </Button>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-2">Troubleshooting Steps</h4>
                    <ol className="text-sm text-yellow-700 space-y-1">
                      <li className="flex items-start">
                        <span className="font-bold mr-2">1.</span>
                        <span>Click "Force Refresh" to reload data from database</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">2.</span>
                        <span>Check if API response matches context state</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">3.</span>
                        <span>Clear browser cache and cookies if needed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">4.</span>
                        <span>Log out and log back in</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold mr-2">5.</span>
                        <span>Contact support if issue persists</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Local Storage Info */}
        {debugInfo.localStorage && (
          <Card className="bg-white border-2 border-orange-200 shadow-lg">
            <CardHeader className="bg-orange-50 border-b border-orange-200">
              <CardTitle className="flex items-center space-x-2 text-orange-900">
                <Database className="w-5 h-5 text-orange-600" />
                <span>Local Storage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700 font-medium">Has User Preferences:</span>
                  <Badge variant={debugInfo.localStorage.hasUserPreferences ? "default" : "secondary"} className="ml-2">
                    {debugInfo.localStorage.hasUserPreferences ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-700 font-medium">Storage Keys:</span>
                  <div className="mt-2 text-sm text-gray-600 font-mono bg-white p-2 rounded border">
                    {debugInfo.localStorage.keys.join(', ')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
} 