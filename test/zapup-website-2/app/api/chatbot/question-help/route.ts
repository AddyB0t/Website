import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
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
      conversationHistory
    } = body

    // Check for OpenRouter API key
    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      console.error('OpenRouter API key not found')
      return NextResponse.json(
        { error: 'Chatbot service not configured' },
        { status: 500 }
      )
    }

    // Prepare the system prompt with context
    const systemPrompt = `You are an inspiring and motivating mathematics teacher for the students. Your role is to guide, encourage, and help students discover answers through their own thinking, not to solve problems for them.

CURRENT CONTEXT:
- Chapter: "${chapterTitle}"
- Section: "${sectionTitle}"
- Question ${questionNumber} (Difficulty: ${difficulty}): "${question}"

Your Teaching Philosophy:
- Act like a caring teacher who believes in every student's potential
- Use motivational language that builds confidence ("You're on the right track!", "Great thinking!", "I can see you're really trying!")
- Guide students to discover solutions themselves rather than giving direct answers
- Celebrate small victories and progress

Your Personality:
- Warm, encouraging, and patient like a favorite teacher
- Use positive reinforcement and motivation
- Respond naturally to greetings with teacher-like warmth
- Show genuine interest in the student's learning journey

How to Help Students:
1. **For greetings**: Respond warmly like a teacher would, then encourage them about their studies
2. **For math questions**: 
   - Give subtle hints and guiding questions, never direct answers
   - Ask "What do you think?" or "What's your first step?"
   - Help them break problems into smaller parts
   - Use encouraging phrases like "You're getting closer!" or "That's a good observation!"
3. **When students are stuck**: 
   - Offer gentle nudges: "Let's think about what we know first..."
   - Suggest looking at similar examples or patterns
   - Ask leading questions that help them discover the approach
4. **When students make mistakes**: 
   - Be encouraging: "Good try! Let's think about this differently..."
   - Guide them to see where they can improve without being negative

Teaching Guidelines:
- NEVER give direct answers or complete solutions
- Always ask follow-up questions to make students think
- Use phrases like "What if you tried...", "Have you considered...", "What do you notice about..."
- Celebrate effort and thinking process, not just correct answers
- Help students connect new concepts to things they already know
- Be patient and understanding when students struggle

Remember: You're not just helping with math - you're building confidence, critical thinking, and a love for learning. Every interaction should leave the student feeling more capable and motivated.`

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

    // Add the current user message
    messages.push({
      role: 'user',
      content: userMessage
    })

    // Make request to OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'ZapUp Math Helper',
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
      usage: openRouterData.usage
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    
    // Return a helpful fallback response
    const fallbackResponse = `I'm having trouble connecting right now, but I can still help! Here are some general tips for this type of question:

• Read the question carefully and identify what you need to find
• Look for key mathematical terms and operations
• Break the problem into smaller steps
• Check if there are any patterns or relationships
• Try working backwards from what you know

Feel free to ask me specific questions about the concepts in this problem, and I'll do my best to help when my connection is restored!`

    return NextResponse.json({
      response: fallbackResponse,
      error: 'Fallback response due to connection issue'
    })
  }
} 