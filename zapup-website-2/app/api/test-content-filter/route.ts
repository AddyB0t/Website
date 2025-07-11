// zapup-website-2/app/api/test-content-filter/route.ts
// Test API endpoint to verify content filtering guardrails
// Allows testing educational vs non-educational content detection

import { NextRequest, NextResponse } from 'next/server'

// Educational content filter - same as in chatbot API
function isEducationalContent(userMessage: string): boolean {
  const message = userMessage.toLowerCase().trim()
  
  // List of non-educational keywords that indicate off-topic questions
  const offTopicKeywords = [
    // Personal/Social
    'girlfriend', 'boyfriend', 'dating', 'love', 'crush', 'relationship',
    'party', 'alcohol', 'drugs', 'smoking', 'drinking',
    
    // Entertainment
    'movie', 'film', 'netflix', 'youtube', 'instagram', 'facebook', 'tiktok',
    'game', 'gaming', 'video game', 'mobile game', 'fortnite', 'pubg',
    'song', 'music', 'singer', 'artist', 'album', 'spotify',
    
    // Current events/News (unless educational context)
    'news', 'politics', 'election', 'government', 'president', 'minister',
    'celebrity', 'actor', 'actress', 'bollywood', 'hollywood',
    
    // Technology (unless educational)
    'mobile phone', 'smartphone', 'iphone', 'android', 'laptop buying',
    'car', 'bike', 'vehicle', 'purchase', 'buy', 'shopping',
    
    // Inappropriate content
    'violence', 'fight', 'war', 'weapon', 'gun', 'bomb',
    'sex', 'adult', 'inappropriate'
  ]
  
  // Check for off-topic keywords
  const containsOffTopicKeywords = offTopicKeywords.some(keyword => 
    message.includes(keyword)
  )
  
  if (containsOffTopicKeywords) {
    return false
  }
  
  // List of educational indicators
  const educationalKeywords = [
    // General academic
    'study', 'learn', 'understand', 'explain', 'concept', 'theory',
    'homework', 'assignment', 'project', 'exam', 'test', 'quiz',
    'chapter', 'lesson', 'topic', 'subject', 'curriculum',
    
    // Mathematics
    'math', 'mathematics', 'algebra', 'geometry', 'trigonometry', 'calculus',
    'equation', 'formula', 'solve', 'calculate', 'number', 'fraction',
    'decimal', 'percentage', 'ratio', 'proportion', 'graph',
    
    // Science
    'science', 'physics', 'chemistry', 'biology', 'experiment',
    'atom', 'molecule', 'cell', 'organism', 'planet', 'gravity',
    'energy', 'force', 'reaction', 'evolution', 'ecosystem',
    
    // English/Language
    'grammar', 'sentence', 'paragraph', 'essay', 'story', 'poem',
    'literature', 'novel', 'author', 'character', 'plot',
    'vocabulary', 'meaning', 'definition', 'spelling',
    
    // Social Studies/History
    'history', 'geography', 'civilization', 'culture', 'society',
    'country', 'continent', 'map', 'timeline', 'ancient', 'medieval',
    'independence', 'freedom fighter', 'constitution',
    
    // General academic activities
    'question', 'answer', 'solution', 'method', 'step', 'process',
    'example', 'practice', 'exercise', 'problem', 'doubt', 'confusion'
  ]
  
  // Check for educational indicators
  const containsEducationalKeywords = educationalKeywords.some(keyword => 
    message.includes(keyword)
  )
  
  // If it contains educational keywords, it's likely educational
  if (containsEducationalKeywords) {
    return true
  }
  
  // Check for question patterns that indicate learning intent
  const learningPatterns = [
    /what is/i, /what are/i, /how to/i, /how do/i, /how can/i,
    /why is/i, /why do/i, /why does/i, /when is/i, /when do/i,
    /where is/i, /where do/i, /which is/i, /which are/i,
    /can you explain/i, /can you help/i, /i don't understand/i,
    /help me/i, /teach me/i, /show me/i,
    /what does.*mean/i, /how does.*work/i, /what happens when/i
  ]
  
  const hasLearningPattern = learningPatterns.some(pattern => 
    pattern.test(message)
  )
  
  if (hasLearningPattern) {
    return true
  }
  
  // If it's a very short message (like greetings), allow it
  if (message.length < 10) {
    return true
  }
  
  // Default to false for ambiguous content
  return false
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    const isEducational = isEducationalContent(message)
    
    return NextResponse.json({
      message,
      isEducational,
      status: isEducational ? 'ALLOWED' : 'BLOCKED',
      reason: isEducational 
        ? 'Content appears to be educational and is allowed'
        : 'Content appears to be non-educational and would be blocked'
    })
    
  } catch (error) {
    console.error('Content filter test error:', error)
    return NextResponse.json(
      { error: 'Failed to test content filter' },
      { status: 500 }
    )
  }
} 