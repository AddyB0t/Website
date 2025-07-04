import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
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

    // Generate answer with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system", 
          content: "You are an expert educational assistant specializing in clear, methodical explanations for students."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const answer = completion.choices[0].message.content || "Sorry, I couldn't generate an answer for this question.";

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