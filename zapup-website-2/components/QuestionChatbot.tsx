// zapup-website-2/components/QuestionChatbot.tsx
// Question chatbot with theme-matched styling and bubble prompts
// Provides study assistance with clean, bubble-based prompt selection

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions'
import { CHATBOT_PROMPTS, PROMPT_CATEGORIES, ChatbotPrompt } from '@/lib/chatbot-prompts'
import { QuestionUsageDisplay } from './QuestionUsageDisplay'
import { PhotoUpload } from './PhotoUpload'
import { 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2, 
  X,
  MessageCircle,
  Loader2,
  ArrowLeft,
  Crown,
  Camera,
  Image as ImageIcon
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuestionChatbotProps {
  currentQuestion: string
  chapterTitle: string
  sectionTitle: string
  questionNumber: number
  difficulty: string
}

export function QuestionChatbot({ 
  currentQuestion, 
  chapterTitle, 
  sectionTitle, 
  questionNumber,
  difficulty 
}: QuestionChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPromptSelection, setShowPromptSelection] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { preferences } = useUserPreferences()

  const subscriptionFeatures = SUBSCRIPTION_FEATURES[preferences.subscriptionType]
  const isLimitedChatbot = subscriptionFeatures.chatbotMode === 'limited'
  const hasFullChatbot = subscriptionFeatures.chatbotMode === 'full'
  const canUploadImages = subscriptionFeatures.imageUpload

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Only auto-scroll for user messages, not LLM responses
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        scrollToBottom()
      }
    }
  }, [messages])

  // Initialize with a welcome message when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      let welcomeContent = ''
      
      if (isLimitedChatbot) {
        welcomeContent = `Hi there! 👋 I'm your Study Helper. I'm here to help you with questions about this problem!

I can help you with common questions about:
• Understanding what the question is asking
• Getting hints on how to solve it
• Checking your work
• Understanding the concepts

Choose from the question bubbles below to get started! 😊`
      } else {
        welcomeContent = `Hi there! 👋 I'm your Study Helper. I'm here to help you with your educational journey!

I can help you with:
• This current question if you're stuck
• Explaining concepts from any subject
• Math, Science, English, Social Studies topics
• Study methods and learning strategies

📚 I focus only on educational topics to help you learn better. You can ask me anything related to your studies or choose from the question bubbles below! 😊`
      }

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
      
      // For limited chatbot, show prompt selection by default
      if (isLimitedChatbot) {
        setShowPromptSelection(true)
      }
    }
  }, [isOpen, messages.length, isLimitedChatbot])

  const sendMessage = async (messageText?: string, promptId?: string) => {
    const messageToSend = messageText || inputValue.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setShowPromptSelection(false)

    try {
      const response = await fetch('/api/chatbot/question-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,
          chapterTitle,
          sectionTitle,
          questionNumber,
          difficulty,
          userMessage: messageToSend,
          conversationHistory: messages.slice(-6), // Last 6 messages for context
          promptId,
          isHardcodedPrompt: !!promptId
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.requiresPromptSelection) {
          setShowPromptSelection(true)
          throw new Error('Please select from the available question options.')
        }
        if (errorData.content_filtered) {
          throw new Error('🎓 ' + errorData.error)
        }
        throw new Error(errorData.error || 'Failed to get response from chatbot')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Trigger usage refresh
      if (typeof window !== 'undefined') {
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('questionAsked'))
        
        // Also call global refresh function if available
        if ((window as any).refreshQuestionUsage) {
          setTimeout(() => {
            (window as any).refreshQuestionUsage()
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Chatbot error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again or choose from the available question options.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptSelect = (prompt: ChatbotPrompt) => {
    sendMessage(prompt.label, prompt.id)
    setSelectedCategory(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleImageUploaded = (imageData: string, imageUrl: string) => {
    // Add image message to chat
    const imageMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `📷 Uploaded question image`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, imageMessage])
  }

  const handleImageAnalysis = async (analysis: string) => {
    setIsAnalyzingImage(false)
    setShowPhotoUpload(false)
    
    // Add AI analysis as assistant message
    const analysisMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: analysis,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, analysisMessage])

    // Trigger usage refresh for photo analysis
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('questionAsked'))
      if ((window as any).refreshQuestionUsage) {
        setTimeout(() => {
          (window as any).refreshQuestionUsage()
        }, 1000)
      }
    }
  }

  const renderPromptSelection = () => {
    if (selectedCategory) {
      const categoryPrompts = CHATBOT_PROMPTS.filter(p => p.category === selectedCategory)
      const categoryInfo = PROMPT_CATEGORIES[selectedCategory as keyof typeof PROMPT_CATEGORIES]
      
      return (
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 bg-white shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 text-gray-700" />
            </button>
            <div>
              <h4 className="font-medium text-gray-900">{categoryInfo.label}</h4>
              <p className="text-sm text-gray-600">{categoryInfo.description}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {categoryPrompts.map((prompt) => (
              <div
                key={prompt.id}
                onClick={() => handlePromptSelect(prompt)}
                className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
              >
                <span className="text-sm text-green-800">{prompt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPromptSelection(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 bg-white shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 text-gray-700" />
          </button>
          <div className="text-center flex-1">
            <h4 className="font-medium text-gray-900 mb-2">How can I help you?</h4>
            <p className="text-sm text-gray-600">Choose a category to see common questions:</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(PROMPT_CATEGORIES).map(([key, category]) => (
            <div
              key={key}
              onClick={() => setSelectedCategory(key)}
              className="bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col items-center space-y-2"
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs text-center font-medium text-green-800">{category.label}</span>
            </div>
          ))}
        </div>
        
        {hasFullChatbot && (
          <div className="pt-2 border-t border-gray-200">
            <div
              onClick={() => setShowPromptSelection(false)}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-3 cursor-pointer transition-all duration-200 text-center"
            >
              <span className="text-sm text-gray-700">Or ask me anything directly</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Don't show chatbot if user doesn't have access
  if (!subscriptionFeatures.chatbot) {
    return null
  }

  return (
    <Card className={`fixed bottom-4 right-2 md:right-4 z-50 shadow-lg transition-all duration-300 bg-white ${
      isOpen ? 'w-72 md:w-80 h-[400px] md:h-[480px]' : 'w-14 h-14 rounded-full'
    }`}>
      <CardHeader className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white ${
        isOpen ? 'p-3 rounded-t-lg' : 'p-0 rounded-full h-full flex items-center justify-center'
      }`}>
        <div className="flex items-center justify-between">
          {isOpen ? (
            <>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <span className="text-base font-semibold">Study Helper</span>
              </CardTitle>
              
              <div className="flex items-center space-x-1">
                <div className="bg-white/20 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                  Q{questionNumber}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  className="h-7 w-7 text-white hover:bg-green-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-12 w-12 text-white hover:bg-green-500 rounded-full"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>

      {isOpen && !isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(400px-64px)] md:h-[calc(480px-64px)]">
          {/* Usage Display for Explorer Plan */}
          <QuestionUsageDisplay 
            subjectId="mathematics" 
            classId="7" 
            showInChatbot={true} 
          />
          
          {showPromptSelection ? (
            renderPromptSelection()
          ) : showPhotoUpload ? (
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200">
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="p-2 rounded-full hover:bg-blue-50 transition-colors border border-blue-200"
                >
                  <ArrowLeft className="h-4 w-4 text-blue-600" />
                </button>
                <h4 className="font-semibold text-gray-900">Upload Question Image</h4>
              </div>
              
              <PhotoUpload
                onImageUploaded={handleImageUploaded}
                onAnalysisResult={handleImageAnalysis}
                isAnalyzing={isAnalyzingImage}
              />
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-2.5 ${
                        message.role === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Bot className="h-4 w-4 mt-0.5 text-green-600" />
                        )}
                        {message.role === 'user' && (
                          <User className="h-4 w-4 mt-0.5 text-white" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap break-words max-w-full overflow-hidden">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-3 flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-green-600" />
                      <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Action area for both limited and full chatbot */}
              <div className="border-t bg-gray-50">
                {/* Action buttons */}
                <div className="px-3 py-2 space-y-2">
                  {/* Quick questions bubble */}
                  <div
                    onClick={() => setShowPromptSelection(true)}
                    className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl p-2 cursor-pointer transition-all duration-200 text-center"
                  >
                    <span className="text-xs text-green-800">Ask another question</span>
                  </div>

                  {/* Photo upload bubble - only for Achiever/Genius+ */}
                  {canUploadImages && (
                    <div
                      onClick={() => setShowPhotoUpload(true)}
                      className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl p-2 cursor-pointer transition-all duration-200 text-center"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <Camera className="w-3 h-3 text-purple-700" />
                        <span className="text-xs text-purple-800">Upload image</span>
                        <Crown className="w-3 h-3 text-purple-700" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input - only show for full chatbot mode */}
                {hasFullChatbot && (
                  <div className="px-3 pb-3">
                    <div className="flex space-x-1">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about this question..."
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={() => sendMessage()}
                        disabled={!inputValue.trim() || isLoading}
                        size="icon"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  )
} 