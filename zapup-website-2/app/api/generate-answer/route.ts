import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getClassInfo, getLanguageGuidelinesForClass, getMaxStepsForClass } from '@/lib/class-curriculum';
import { auth } from '@clerk/nextjs/server';

// Helper to extract class level from various inputs
function extractClassLevel(book?: string, classId?: string): string {
  if (classId) return classId;
  if (book) {
    const match = book.match(/Class (\d+)/);
    if (match) return match[1];
  }
  return '8'; // Default fallback
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenRouter API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY environment variable is not set');
      return NextResponse.json({
        success: false,
        error: 'AI service not configured. Please contact support.',
        details: 'missing_api_key'
      }, { status: 500 });
    }

    const { question, book, chapter, exercise, questionId, classLevel } = await request.json();

    // Extract class level for validation
    const actualClassLevel = classLevel || extractClassLevel(book, questionId?.toString());

    console.log(`🎯 Generating answer for Class ${actualClassLevel}:`, question.substring(0, 100) + '...');

    // STEP 1: Check if a solution already exists in the database
    const { data: existingSolution, error: searchError } = await supabase
      .from('solutions')
      .select('*')
      .eq('question_id', questionId)
      .single();

    // If we have a cached solution, return it immediately
    if (existingSolution && !searchError) {
      console.log(`📋 Using cached solution for question ${questionId}`);
      return NextResponse.json({ 
        success: true,
        answer: existingSolution.text,
        cached: true,
        classLevel: actualClassLevel
      });
    }

    // STEP 3: Check for question image (user or community)
    let questionImageUrl = null;
    let imageSource = null;

    if (questionId) {
      try {
        // Get the authenticated user ID
        const { userId } = await auth();

        // First, try to get the user's own image if they're authenticated
        const { data: userImage } = userId ? await supabase
          .from('uploaded_question_images')
          .select('image_url')
          .eq('question_id', questionId)
          .eq('user_id', userId)
          .eq('is_community', false)
          .single() : { data: null };

        if (userImage) {
          questionImageUrl = userImage.image_url;
          imageSource = 'user' as const;
          console.log(`📷 Found user image for question ${questionId}`);
        } else {
          // Check for community image
          const { data: communityImage } = await supabase
            .from('uploaded_question_images')
            .select('image_url')
            .eq('question_id', questionId)
            .eq('is_community', true)
            .single();

          if (communityImage) {
            questionImageUrl = communityImage.image_url;
            imageSource = 'community' as const;
            console.log(`📷 Found community image for question ${questionId}`);
          }
        }
      } catch (err) {
        console.log(`ℹ️ No image found for question ${questionId}`);
      }
    }

    // STEP 4: Generate class-specific prompt
    const classInfo = getClassInfo(actualClassLevel);
    const maxSteps = getMaxStepsForClass(actualClassLevel);
    const languageGuidelines = getLanguageGuidelinesForClass(actualClassLevel);

    const prompt = generateClassSpecificPrompt({
      question,
      book: book || `Class ${actualClassLevel} Mathematics`,
      chapter: chapter || 'Current Chapter',
      exercise: exercise || 'Practice Questions',
      classLevel: actualClassLevel,
      classInfo,
      maxSteps,
      languageGuidelines,
      hasImage: !!questionImageUrl,
      imageSource
    });

    // Generate answer with OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'ZapUp Math Solver',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet', // Using Claude 3.5 Sonnet for better math solutions
        messages: [
          {
            role: 'system',
            content: getSystemPromptForClass(actualClassLevel)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3, // Lower temperature for more consistent math solutions
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', errorText);
      
      if (openRouterResponse.status === 429) {
        return NextResponse.json({
          success: false,
          error: 'Too many requests. Please wait a moment and try again.',
          details: 'rate_limited'
        }, { status: 429 });
      }
      
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const openRouterData = await openRouterResponse.json();
    
    if (!openRouterData.choices || !openRouterData.choices[0] || !openRouterData.choices[0].message) {
      console.error('Invalid response from OpenRouter:', openRouterData);
      throw new Error('Invalid response from OpenRouter');
    }

    let answer = openRouterData.choices[0].message.content || "Sorry, I couldn't generate an answer for this question.";
    
    // STEP 4: Post-process answer for quality and appropriateness
    answer = postProcessAnswer(answer, actualClassLevel);
    
    console.log(`✅ Answer generated successfully for Class ${actualClassLevel} question ${questionId}`);

    // STEP 5: Store the generated answer in the database for future use
    if (questionId) {
      try {
        await supabase.from('solutions').insert({
          question_id: questionId,
          text: answer,
          is_ai_generated: true,
          class_level: actualClassLevel,
          generated_at: new Date().toISOString()
        });
        console.log(`💾 Solution cached for question ${questionId}`);
      } catch (dbError) {
        console.error('Error caching solution:', dbError);
        // Don't fail the request if caching fails
      }
    }

    return NextResponse.json({ 
      success: true,
      answer,
      classLevel: actualClassLevel,
      generated: true
    });
  } catch (error) {
    console.error('❌ Error generating answer:', error);
    
    // Provide helpful error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('OpenRouter')) {
        return NextResponse.json({
          success: false,
          error: 'AI service temporarily unavailable. Please try again in a few minutes.',
          details: 'openrouter_error'
        }, { status: 503 });
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json({
          success: false,
          error: 'Request timed out. Please try again with a shorter question.',
          details: 'timeout_error'
        }, { status: 408 });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unable to generate answer at this time. Please try again later or consult your textbook.',
      details: 'general_error'
    }, { status: 500 });
  }
}

// Helper function to generate class-specific prompts
function generateClassSpecificPrompt(params: {
  question: string;
  book: string;
  chapter: string;
  exercise: string;
  classLevel: string;
  classInfo: any;
  maxSteps: number;
  languageGuidelines: string;
  hasImage?: boolean;
  imageSource?: 'user' | 'community' | null;
}): string {
  const { question, book, chapter, exercise, classLevel, classInfo, maxSteps, languageGuidelines, hasImage, imageSource } = params;
  
  const ageInfo = classInfo ? `(ages ${classInfo.age}, ${classInfo.level} level)` : '';
  const focusAreas = classInfo?.learningFocus?.slice(0, 3).join(', ') || 'mathematics fundamentals';
  
  return `You are helping a Class ${classLevel} student ${ageInfo} solve an academic question.

CONTEXT:
- Book: ${book}
- Chapter: ${chapter}
- Exercise: ${exercise}
- Student Level: ${classInfo?.cognitiveStage || 'Age-appropriate learning stage'}
- Focus Areas: ${focusAreas}

EXERCISE CONTEXT:
- If available, include related examples from this exercise
- Reference exercise number and name in your explanation
- Connect to similar problems in the same exercise section
- Mention the exercise type (e.g., "This is from ${exercise}, which focuses on...")

LANGUAGE GUIDELINES:
${languageGuidelines}

SOLUTION REQUIREMENTS:
- Maximum ${maxSteps} steps (keep it concise)
- Use age-appropriate terminology for the subject
- Explain WHY each step is necessary
- Connect to real-world examples when helpful
- Include relevant worked examples from the same exercise or chapter
- If the question seems too advanced, suggest consulting a teacher

IMPORTANT: Do NOT ask follow-up questions. Provide complete, direct solutions based on the information given. Answer the question fully without requesting clarification.

EXERCISE IDENTIFICATION:
- Extract exercise number (e.g., "1.1", "2.3") from question context
- Extract exercise name (e.g., "Word Problems", "Practice Set") if mentioned
- Include relevant worked examples from the same exercise or chapter

${hasImage ? `IMAGE CONTEXT:
- An image has been uploaded for this question (source: ${imageSource === 'user' ? 'student upload' : 'community'})
- The image may contain diagrams, figures, or additional visual information needed to solve the problem
- Reference the visual elements when explaining your solution
- If the question references a diagram or figure, assume it is provided in the uploaded image
` : ''}
QUESTION:
${question}

Provide a clear, step-by-step explanation or solution that a Class ${classLevel} student can understand and learn from. Reference the exercise context and include examples when helpful.${hasImage ? ' If the question requires visual information (diagrams, graphs, etc.), acknowledge the uploaded image in your explanation.' : ''}`;
}

// Helper function to get system prompt based on class level
function getSystemPromptForClass(classLevel: string): string {
  const classNum = parseInt(classLevel);

  if (classNum <= 8) {
    return `You are an expert academic tutor helping a Class ${classNum} student.

Your expertise includes all subjects at all levels:
- Mathematics: From basic arithmetic to advanced concepts
- Science: Physics, Chemistry, Biology at all levels
- Social Studies: History, Geography, Civics
- English: Literature, Grammar, Comprehension
- All academic topics regardless of difficulty level

IMPORTANT:
- Do NOT ask follow-up questions
- Provide complete, direct solutions
- Answer ALL questions thoroughly, regardless of topic difficulty
- Explain concepts clearly and adjust explanation depth as needed`;
  } else if (classNum <= 10) {
    return `You are an expert academic tutor helping a Class ${classNum} student.

Your expertise includes all subjects at all levels:
- Mathematics: Algebra, Geometry, Trigonometry, Calculus, Statistics
- Science: Physics, Chemistry, Biology at all levels
- Social Studies: History, Geography, Political Science, Economics
- English: Literature, Grammar, Writing Skills
- All academic topics regardless of difficulty level

IMPORTANT:
- Do NOT ask follow-up questions
- Provide complete, direct solutions
- Answer ALL questions thoroughly, regardless of topic difficulty
- Explain concepts clearly and adjust explanation depth as needed`;
  } else {
    return `You are an expert academic tutor helping a Class ${classNum} student.

Your expertise includes all subjects at all levels:
- Mathematics: Calculus, Advanced Algebra, Statistics, Applied Mathematics
- Science: Advanced Physics, Chemistry, Biology
- Humanities: History, Political Science, Economics, Geography, Psychology
- Commerce: Accountancy, Business Studies, Economics
- English: Literature Analysis, Advanced Writing, Language Studies
- All academic topics regardless of difficulty level

IMPORTANT:
- Do NOT ask follow-up questions
- Provide complete, comprehensive solutions directly
- Answer ALL questions thoroughly, regardless of topic difficulty
- Suitable for board exams, competitive exams, and higher education`;
  }
}

// Helper function to post-process answers
function postProcessAnswer(answer: string, classLevel: string): string {
  // Remove any inappropriate content that might have slipped through
  const inappropriateTerms = [
    'regression coefficient', 'correlation analysis', 'standard deviation',
    'hypothesis testing', 'p-value', 'chi-square', 'ANOVA'
  ];
  
  const classNum = parseInt(classLevel);
  
  for (const term of inappropriateTerms) {
    if (answer.toLowerCase().includes(term.toLowerCase()) && classNum < 11) {
      return `I notice this question involves advanced statistical concepts (${term}) that are typically covered in Classes 11-12. For Class ${classLevel}, I'd recommend focusing on basic data handling and simple statistics. Please consult your teacher for guidance on this specific topic.`;
    }
  }
  
  // Add a helpful note for elementary classes
  if (classNum <= 8 && answer.length > 800) {
    answer = answer.substring(0, 600) + '...\n\nNote: If you need more detailed steps, please ask your teacher for additional help!';
  }
  
  return answer;
}