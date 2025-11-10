import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { SUBSCRIPTION_FEATURES, SubscriptionType } from '@/lib/subscriptions'
import { getPromptById } from '@/lib/chatbot-prompts'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Educational content filter - checks if a question is education-related
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
    const body = await request.json()
    const {
      question,
      chapterTitle,
      sectionTitle,
      questionNumber,
      difficulty,
      userMessage,
      conversationHistory,
      promptId, // New field for hardcoded prompt selection
      isHardcodedPrompt = false // New field to indicate if this is a predefined prompt
    } = body

    // Get user information
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get user subscription type from database
    const { data: userPreferences, error: userError } = await supabase
      .from('user_preferences')
      .select('subscription_type')
      .eq('user_id', userId)
      .single()

    if (userError || !userPreferences) {
      return NextResponse.json(
        { error: 'Could not fetch user preferences' },
        { status: 500 }
      )
    }

    const subscriptionType = (userPreferences.subscription_type || 'explorer') as SubscriptionType
    const features = SUBSCRIPTION_FEATURES[subscriptionType]

    // Check if user has chatbot access
    if (!features.chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not available in your current plan' },
        { status: 403 }
      )
    }

    // For limited chatbot mode, only allow hardcoded prompts
    if (features.chatbotMode === 'limited' && !isHardcodedPrompt) {
      return NextResponse.json(
        { 
          error: 'Free chat not available in your plan',
          requiresPromptSelection: true 
        },
        { status: 403 }
      )
    }

    // EDUCATIONAL CONTENT GUARDRAILS - Apply to ALL subscription types including Genius+
    // Skip validation for hardcoded prompts as they are pre-approved
    if (!isHardcodedPrompt && !isEducationalContent(userMessage)) {
      return NextResponse.json(
        { 
          error: 'I can only help with educational questions related to your studies. Please ask questions about mathematics, science, English, social studies, or other academic topics.',
          content_filtered: true
        },
        { status: 400 }
      )
    }

    // Check daily question limits - ONLY for Explorer plan
    if (subscriptionType === 'explorer' && features.maxQuestionsPerDay !== Infinity) {
      // Extract subject and class from the question context (default to 'mathematics' and derived from context)
      const subjectId = 'mathematics' // Default to mathematics, can be extended later
      const classId = '7' // Default to class 7, can be extracted from context later
      
      try {
        // Check and increment usage directly via database
        const { data: usageData, error: usageError } = await supabase
          .rpc('increment_question_usage', {
            p_user_id: userId,
            p_subject_id: subjectId,
            p_class_id: classId
          })

        if (usageError) {
          console.error('Error checking usage limits:', usageError)
          // Continue with the request if usage check fails
        } else {
          const usage = usageData?.[0]
          if (usage && usage.current_usage > features.maxQuestionsPerDay) {
            return NextResponse.json(
              { 
                error: `You have reached your daily question limit of ${features.maxQuestionsPerDay} questions for this subject. Upgrade to Scholar plan for unlimited questions!`,
                limit_exceeded: true,
                upgrade_required: true,
                current_usage: usage.current_usage,
                max_allowed: features.maxQuestionsPerDay,
                remaining: Math.max(0, features.maxQuestionsPerDay - usage.current_usage)
              },
              { status: 429 }
            )
          }
        }
      } catch (error) {
        console.error('Error checking usage limits:', error)
        // Continue with the request if usage check fails
      }
    }
    
    // For Scholar, Achiever, and Genius+ plans: unlimited questions (no tracking needed)

    // If it's a hardcoded prompt, get the actual prompt text
    let actualUserMessage = userMessage
    if (isHardcodedPrompt && promptId) {
      const prompt = getPromptById(promptId)
      if (prompt) {
        actualUserMessage = prompt.prompt
      }
    }

    // Check for OpenRouter API key
    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      console.error('OpenRouter API key not found')
      return NextResponse.json(
        { error: 'Chatbot service not configured' },
        { status: 500 }
      )
    }

    // Prepare the system prompt with context and educational guardrails
    const systemPrompt = `You are a friendly, helpful, and inspiring study helper for students. Your role is to help students learn and understand academic topics, guide them through problems, and support their educational journey.

IMPORTANT: Focus on educational topics. If a student asks about non-educational topics (personal life, entertainment, etc.), you can briefly acknowledge it but gently guide them back to their studies.

CURRENT CONTEXT:
- Chapter: "${chapterTitle}"
- Section: "${sectionTitle}"
- Question ${questionNumber} (Difficulty: ${difficulty}): "${question}"
- Student's subscription: ${subscriptionType}

Your Approach:
- Be warm, encouraging, and patient
- Help students understand concepts and solve problems
- Guide them to discover solutions through thinking and reasoning
- Provide clear explanations and examples when needed
- Celebrate effort and progress
- Be flexible and adapt to different learning styles
- Support learning across all subjects and class levels

How to Help:
1. **For academic questions**:
   - Explain concepts clearly with examples
   - Break problems into understandable steps
   - Provide detailed solutions directly
   - Adapt explanations based on the subject matter

2. **When students are stuck**:
   - Offer helpful guidance and examples
   - Suggest different approaches to solving problems
   - Reference similar concepts they might have learned
   - Be patient and encouraging

3. **When students make mistakes**:
   - Be supportive and positive
   - Help them identify what went wrong
   - Guide them toward the correct approach

4. **For any academic topic**:
   - Help with homework, assignments, and test preparation
   - Explain difficult concepts
   - Provide study strategies and tips
   - Answer questions about any subject at any level

IMPORTANT: Do NOT ask follow-up questions or prompt students to clarify. Provide complete, direct answers based on the information given. Answer the question fully without requesting additional information.

Teaching Philosophy:
- Support learning at ALL levels - from elementary to advanced university topics
- Answer ALL questions thoroughly, regardless of difficulty or complexity
- Be flexible with explanation depth - provide as much detail as needed
- Use real-world examples and relatable scenarios
- Build confidence through positive reinforcement
- Make learning engaging and enjoyable
- Help students develop critical thinking skills
- Never restrict answers based on age, class level, or topic difficulty

Subject Coverage:
- **Mathematics**: All levels from basic arithmetic to advanced calculus, linear algebra, differential equations - explain step by step
- **Science**: Physics, Chemistry, Biology at all levels including advanced topics - explain mechanisms and concepts clearly
- **Commerce**: Accountancy, Business Studies, Economics at all levels
- **English**: Grammar, literature, writing, comprehension - provide detailed feedback
- **Social Studies**: History, Geography, Political Science, Economics, Sociology - explain context and connections
- **Languages**: Grammar, vocabulary, communication - support language learning
- **All Academic Topics**: Provide comprehensive help across any subject at any difficulty level

Remember: You're here to support student learning. Be helpful, patient, and encouraging. Help students understand concepts deeply, not just pass tests. Answer questions thoroughly and provide the guidance they need to succeed in their studies.`

    // Prepare conversation messages
    const messages: Message[] = [
      { role: 'user' as const, content: systemPrompt }
    ]

    // Add conversation history (last few messages for context)
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          })
        }
      })
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: actualUserMessage
    })

    // Make request to OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'ZapUp Study Helper',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet', // Using Claude 3.5 Sonnet
        messages: messages,
        max_tokens: 500,
        temperature: 0.4,
        top_p: 0.9,
      }),
    })

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text()
      console.error('OpenRouter API error:', errorText)
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`)
    }

    const openRouterData = await openRouterResponse.json()
    
    if (!openRouterData.choices || !openRouterData.choices[0] || !openRouterData.choices[0].message) {
      console.error('Invalid response from OpenRouter:', openRouterData)
      throw new Error('Invalid response from OpenRouter')
    }

    const assistantResponse = openRouterData.choices[0].message.content

    return NextResponse.json({
      response: assistantResponse,
      model: openRouterData.model,
      usage: openRouterData.usage,
      subscriptionType,
      chatbotMode: features.chatbotMode
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    
    // Return a helpful fallback response
    const fallbackResponse = `I'm having trouble connecting right now, but I can still help! Here are some general tips for this type of question:

• Read the question carefully and identify what you need to find
• Look for key terms and concepts
• Break the problem into smaller steps
• Check if there are any patterns or relationships
• Try working backwards from what you know
• Consider what you've learned in this chapter/topic

Feel free to ask me specific questions about the concepts in this problem, and I'll do my best to help when my connection is restored!`

    return NextResponse.json({
      response: fallbackResponse,
      error: 'Fallback response due to connection issue'
    })
  }
} 