// My Images page - Gallery of student's uploaded question images
// Integrated with Study Helper for AI assistance

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { ImageGallery, ImageGalleryRef } from '@/components/ImageGallery'
import { PhotoUpload } from '@/components/PhotoUpload'
import { QuestionChatbot } from '@/components/QuestionChatbot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image as ImageIcon, Camera, HelpCircle, Upload, Sparkles, X, MessageSquare, Send, AlertCircle } from 'lucide-react'
import { UploadedImage } from '@/lib/supabase'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions'

export default function MyImagesPage() {
  const { preferences } = useUserPreferences()
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [imageAnalysis, setImageAnalysis] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [showStudyHelper, setShowStudyHelper] = useState(false)
  const [helperSize, setHelperSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [error, setError] = useState<string | null>(null)
  const [analysisAttempted, setAnalysisAttempted] = useState<Set<string>>(new Set())
  const galleryRef = useRef<ImageGalleryRef>(null)
  const chatMessagesEndRef = useRef<HTMLDivElement>(null)

  const subscriptionFeatures = SUBSCRIPTION_FEATURES[preferences.subscriptionType]

  // Auto-scroll to bottom of chat messages
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleImageClick = useCallback((image: UploadedImage) => {
    setSelectedImage(image)
    setChatMessages([]) // Clear previous chat
    setChatInput('')
    setError(null)
    setShowStudyHelper(true) // Show the floating helper

    // Auto-analyze image when selected if not already analyzed
    // Prevent infinite loops by tracking attempted analyses
    if (!image.analyzed && !image.analysis_text && !analysisAttempted.has(image.id)) {
      setAnalysisAttempted(prev => new Set(prev).add(image.id))
      analyzeSelectedImage(image.image_url, image.id)
    } else if (image.analysis_text) {
      setImageAnalysis(image.analysis_text)
    }
  }, [analysisAttempted])

  const getSizeClasses = () => {
    switch (helperSize) {
      case 'small':
        return 'w-96 h-[32rem]'
      case 'medium':
        return 'w-[32rem] h-[42rem]'
      case 'large':
        return 'w-[36rem] h-[48rem]'
      default:
        return 'w-[32rem] h-[42rem]'
    }
  }

  const analyzeSelectedImage = useCallback(async (imageUrl: string, imageId: string) => {
    // Prevent multiple simultaneous analyses
    if (isAnalyzing) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageUrl,
          type: 'question-analysis'
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.analysis) {
        throw new Error('No analysis received from server')
      }

      setImageAnalysis(data.analysis)
    } catch (error) {
      console.error('Error analyzing image:', error)

      let errorMessage = 'Failed to analyze image. '

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage += 'Request timed out. Please try again.'
        } else {
          errorMessage += error.message
        }
      } else {
        errorMessage += 'Please try again later.'
      }

      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }, [isAnalyzing])

  const handleImageDelete = useCallback((imageId: string) => {
    // Clear selection if deleted image was selected
    if (selectedImage?.id === imageId) {
      setSelectedImage(null)
      setImageAnalysis('')
      setChatMessages([])
      setShowStudyHelper(false)
      setError(null)
    }
    // Remove from analysis tracking
    setAnalysisAttempted(prev => {
      const newSet = new Set(prev)
      newSet.delete(imageId)
      return newSet
    })
  }, [selectedImage])

  const sendChatMessage = useCallback(async (message: string) => {
    if (!message.trim() || !selectedImage || isChatLoading) return

    // Prevent spam/abuse - limit message length
    if (message.length > 1000) {
      setError('Message is too long. Please keep it under 1000 characters.')
      return
    }

    // Prevent too many messages in chat history (memory optimization)
    if (chatMessages.length > 50) {
      setError('Chat history is full. Please start a new conversation.')
      return
    }

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: message.trim() }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout for chat

      // Call backend API to get AI response
      const response = await fetch('/api/chatbot/image-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          imageUrl: selectedImage.image_url,
          previousMessages: chatMessages.slice(-10) // Only send last 10 messages to prevent payload bloat
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))

        if (response.status === 403 && errorData.upgrade_required) {
          throw new Error('This feature requires an Achiever or Genius+ subscription. Please upgrade to continue.')
        }

        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.response) {
        throw new Error('No response received from AI')
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: data.response
      }
      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)

      let errorMessage = 'Sorry, I encountered an error. '

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try asking again with a shorter question.'
        } else {
          errorMessage = error.message
        }
      } else {
        errorMessage += 'Please try again.'
      }

      const errorResponse = {
        role: 'assistant' as const,
        content: errorMessage
      }
      setChatMessages(prev => [...prev, errorResponse])
      setError(errorMessage)
    } finally {
      setIsChatLoading(false)
    }
  }, [selectedImage, chatMessages, isChatLoading])

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt)
  }

  const handleUploadComplete = () => {
    setShowUploadModal(false)
    // Refresh the gallery to show the new image
    setTimeout(() => {
      galleryRef.current?.refresh()
    }, 1000)
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <span>My Images</span>
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  View and manage your uploaded question images
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-purple-100 text-purple-800 border-0">
                  <Camera className="w-3 h-3 mr-1" />
                  Premium Feature
                </Badge>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setShowUploadModal(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Image
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Info Card */}
          <Card className="mb-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-purple-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg shadow-sm">
                  <HelpCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">How to Use My Images</h3>
                  <ul className="text-sm text-gray-700 space-y-1.5">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                      Upload images using the button above
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                      Click any image to get AI help with Study Helper
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                      All your images are saved and organized here
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Gallery - Full Width */}
          <ImageGallery
            ref={galleryRef}
            onImageClick={handleImageClick}
            onImageDelete={handleImageDelete}
            selectedImageId={selectedImage?.id}
          />
        </div>
      </div>

      {/* Floating Study Helper */}
        {showStudyHelper && selectedImage && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className={`absolute bottom-6 right-6 pointer-events-auto ${getSizeClasses()} transition-all duration-300`}>
              <Card className="shadow-2xl border-gray-300 h-full bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-base">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Study Helper
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {/* Size Controls */}
                      <div className="flex items-center space-x-1 bg-white/20 rounded-lg px-2 py-1">
                        <button
                          onClick={() => setHelperSize('small')}
                          className={`text-xs px-1.5 py-0.5 rounded ${helperSize === 'small' ? 'bg-white/30' : 'hover:bg-white/10'}`}
                          title="Small"
                        >
                          S
                        </button>
                        <button
                          onClick={() => setHelperSize('medium')}
                          className={`text-xs px-1.5 py-0.5 rounded ${helperSize === 'medium' ? 'bg-white/30' : 'hover:bg-white/10'}`}
                          title="Medium"
                        >
                          M
                        </button>
                        <button
                          onClick={() => setHelperSize('large')}
                          className={`text-xs px-1.5 py-0.5 rounded ${helperSize === 'large' ? 'bg-white/30' : 'hover:bg-white/10'}`}
                          title="Large"
                        >
                          L
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/20"
                        onClick={() => {
                          setShowStudyHelper(false)
                          setSelectedImage(null)
                          setChatMessages([])
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col h-[calc(100%-3.5rem)] overflow-hidden bg-white">
                  {selectedImage ? (
                    <>
                      {/* Selected Image Preview */}
                      <div className="mb-3 flex-shrink-0">
                        <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 shadow-sm">
                          <img
                            src={selectedImage.image_url}
                            alt="Selected question"
                            className={`w-full object-contain bg-gray-50 ${
                              helperSize === 'small' ? 'h-40' :
                              helperSize === 'medium' ? 'h-56' :
                              'h-72'
                            }`}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5 text-center">
                          {new Date(selectedImage.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Error Display */}
                      {error && (
                        <div className="mb-3 flex-shrink-0">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs text-red-800">{error}</p>
                              <button
                                onClick={() => setError(null)}
                                className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Initial Analysis - Hidden from user, runs in background */}
                      {isAnalyzing && chatMessages.length === 0 && !error && (
                        <div className="text-center py-3 flex-shrink-0">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mx-auto mb-2"></div>
                          <p className="text-xs text-gray-600">Ready to help!</p>
                        </div>
                      )}

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto mb-3 space-y-3 min-h-0" id="chat-messages-container">
                        {chatMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                msg.role === 'user'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-900 border border-gray-200'
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                        {isChatLoading && (
                          <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-gray-100 border border-gray-200">
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                <p className="text-sm text-gray-600">Thinking...</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={chatMessagesEndRef} />
                      </div>

                      {/* Quick Prompts */}
                      <div className="grid grid-cols-1 gap-2 mb-3 flex-shrink-0">
                        <button
                          onClick={() => handleQuickPrompt("What is this question asking?")}
                          disabled={isChatLoading}
                          className="text-left px-3 py-2 text-xs text-gray-900 rounded-xl border border-gray-300 hover:bg-purple-50 hover:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                          <span className="mr-2">💡</span>
                          What is this question asking?
                        </button>
                        <button
                          onClick={() => handleQuickPrompt("Give me hints to solve this")}
                          disabled={isChatLoading}
                          className="text-left px-3 py-2 text-xs text-gray-900 rounded-xl border border-gray-300 hover:bg-purple-50 hover:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                          <span className="mr-2">🎯</span>
                          Give me hints to solve this
                        </button>
                        <button
                          onClick={() => handleQuickPrompt("Explain the solution step-by-step")}
                          disabled={isChatLoading}
                          className="text-left px-3 py-2 text-xs text-gray-900 rounded-xl border border-gray-300 hover:bg-purple-50 hover:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                          <span className="mr-2">📝</span>
                          Explain the solution step-by-step
                        </button>
                      </div>

                      {/* Chat Input */}
                      <div className="relative flex-shrink-0">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !isChatLoading) {
                              sendChatMessage(chatInput)
                            }
                          }}
                          placeholder="Ask anything about this image..."
                          className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                          disabled={isChatLoading}
                        />
                        <Button
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-8 w-8 p-0 disabled:opacity-50"
                          onClick={() => sendChatMessage(chatInput)}
                          disabled={isChatLoading || !chatInput.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Upload Question Image</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-purple-100 text-sm mt-1">
                Take a photo or select an image from your device
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <PhotoUpload
                onImageUploaded={(imageData, imageUrl, imageId) => {
                  handleUploadComplete()
                }}
                onAnalysisResult={(analysis) => {
                  setImageAnalysis(analysis)
                }}
                classLevel={preferences.currentClass || '9'}
                subject={undefined}
              />

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Make sure your image is clear and the text is readable for best results with AI analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  )
}
