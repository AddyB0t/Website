'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, Sparkles, ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isAnimating?: boolean
  imageUrl?: string
}

export default function AskPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded, user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [displayedContent, setDisplayedContent] = useState<Record<string, string>>({})
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeIntervalsRef = useRef<Set<NodeJS.Timeout>>(new Set())

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, displayedContent])

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      activeIntervalsRef.current.forEach(intervalId => clearInterval(intervalId))
      activeIntervalsRef.current.clear()
    }
  }, [])

  // Waterfall/typewriter effect
  const animateText = (messageId: string, fullText: string) => {
    let currentIndex = 0
    setDisplayedContent(prev => ({ ...prev, [messageId]: '' }))

    const intervalId = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedContent(prev => ({
          ...prev,
          [messageId]: fullText.slice(0, currentIndex + 1)
        }))
        currentIndex++
      } else {
        clearInterval(intervalId)
        activeIntervalsRef.current.delete(intervalId)
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, isAnimating: false } : msg
          )
        )
      }
    }, 20) // 20ms per character for smooth effect

    activeIntervalsRef.current.add(intervalId)
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-general-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setUploadedImage(data.imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  // Remove uploaded image
  const removeImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle paste from clipboard
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items || !user) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      // Check if the pasted item is an image
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault() // Prevent default paste behavior

        const file = item.getAsFile()
        if (!file) continue

        setUploadingImage(true)

        try {
          const formData = new FormData()
          formData.append('image', file)

          const response = await fetch('/api/upload-general-image', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            throw new Error('Failed to upload image')
          }

          const data = await response.json()
          setUploadedImage(data.imageUrl)
        } catch (error) {
          console.error('Error uploading pasted image:', error)
          alert('Failed to upload pasted image. Please try again.')
        } finally {
          setUploadingImage(false)
        }

        break // Only handle the first image
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const currentImageUrl = uploadedImage
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      imageUrl: currentImageUrl || undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setUploadedImage(null) // Clear image after sending
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setIsLoading(true)

    try {
      let response;

      // If there's an image, use the image chatbot API
      if (currentImageUrl) {
        response = await fetch('/api/chatbot/image-help', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            imageUrl: currentImageUrl,
            previousMessages: messages.slice(-5).map(m => ({
              role: m.role,
              content: m.content
            }))
          })
        })
      } else {
        // Otherwise use the generate-answer API
        response = await fetch('/api/generate-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: userMessage.content,
            classLevel: '12',
            skipClassValidation: true
          })
        })
      }

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
        isAnimating: true
      }

      setMessages(prev => [...prev, assistantMessage])
      animateText(assistantMessage.id, assistantMessage.content)
    } catch (error) {
      console.error('Error getting response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-73px)] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ask Anything</h1>
                <p className="text-sm text-gray-600">Your AI study assistant is here to help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome to Ask!
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Ask me anything about your studies. I can help with homework, explain concepts, solve problems, and more.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <button
                    className="text-left p-4 bg-white border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all duration-200 hover:bg-green-50"
                    onClick={() => setInput("Explain the concept of photosynthesis")}
                  >
                    <p className="text-sm text-gray-800 font-medium">Explain the concept of photosynthesis</p>
                  </button>
                  <button
                    className="text-left p-4 bg-white border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all duration-200 hover:bg-green-50"
                    onClick={() => setInput("Help me solve quadratic equations")}
                  >
                    <p className="text-sm text-gray-800 font-medium">Help me solve quadratic equations</p>
                  </button>
                  <button
                    className="text-left p-4 bg-white border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all duration-200 hover:bg-green-50"
                    onClick={() => setInput("What is the difference between mitosis and meiosis?")}
                  >
                    <p className="text-sm text-gray-800 font-medium">What is the difference between mitosis and meiosis?</p>
                  </button>
                  <button
                    className="text-left p-4 bg-white border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all duration-200 hover:bg-green-50"
                    onClick={() => setInput("Explain Newton's laws of motion")}
                  >
                    <p className="text-sm text-gray-800 font-medium">Explain Newton's laws of motion</p>
                  </button>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white'
                        : 'bg-white text-gray-900 shadow-md border border-gray-200'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">AI Assistant</span>
                      </div>
                    )}
                    {message.imageUrl && (
                      <div className="mb-3 rounded-lg overflow-hidden border-2 border-white/20">
                        <div className="relative w-full h-48">
                          <Image
                            src={message.imageUrl}
                            alt="Uploaded question"
                            fill
                            className="object-contain bg-white/10"
                          />
                        </div>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">
                      {message.role === 'assistant' && message.isAnimating
                        ? displayedContent[message.id] || ''
                        : message.content}
                    </div>
                    {message.role === 'assistant' && message.isAnimating && (
                      <span className="inline-block w-1 h-4 bg-green-600 animate-pulse ml-0.5" />
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-6 py-4 shadow-md border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            {/* Image Preview */}
            {uploadedImage && (
              <div className="mb-3 relative inline-block">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-green-200">
                  <Image
                    src={uploadedImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Image upload button */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || uploadingImage}
                className="rounded-full h-12 w-12 border-gray-300 hover:border-green-500 hover:bg-green-50"
                title="Upload image"
              >
                {uploadingImage ? (
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                )}
              </Button>

              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask anything or paste an image..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                disabled={isLoading}
                className="flex-1 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-full px-6 py-6 text-base"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full px-8 py-6 h-auto font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
