import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Check if OpenRouter API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const { question, book, chapter, exercise, questionId } = await request.json();

    // Check if a solution already exists in the database
    const { data: existingSolution, error: searchError } = await supabase
      .from('solutions')
      .select('*')
      .eq('question_id', questionId)
      .single();

    // If we have a cached solution, return it immediately
    if (existingSolution && !searchError) {
      return NextResponse.json({ answer: existingSolution.text });
    }

    // Prompt engineering for better answers
    const prompt = `You are a helpful educational assistant solving a question from ${book}, Chapter: ${chapter}, ${exercise}.
    
Question: ${question}
    
Provide a detailed step-by-step solution with clear explanations. Focus on the method and concepts used to solve the problem.`;

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
            content: 'You are an expert educational assistant specializing in clear, methodical explanations for students. Provide detailed step-by-step solutions with clear explanations.'
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
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const openRouterData = await openRouterResponse.json();
    
    if (!openRouterData.choices || !openRouterData.choices[0] || !openRouterData.choices[0].message) {
      console.error('Invalid response from OpenRouter:', openRouterData);
      throw new Error('Invalid response from OpenRouter');
    }

    const answer = openRouterData.choices[0].message.content || "Sorry, I couldn't generate an answer for this question.";

    // Store the generated answer in the database for future use
    if (questionId) {
      await supabase.from('solutions').insert({
        question_id: questionId,
        text: answer,
        is_ai_generated: true,
      });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error generating answer:', error);
    return NextResponse.json(
      { error: 'Failed to generate answer' },
      { status: 500 }
    );
  }
} 