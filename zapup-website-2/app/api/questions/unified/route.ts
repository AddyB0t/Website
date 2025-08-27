import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get user authentication info
  let userContext = null;
  try {
    const { userId } = await auth();
    if (userId) {
      // Fetch user preferences for smart defaults
      const { data: userPrefs } = await supabase
        .from('user_preferences')
        .select('school_type, class_level, stream')
        .eq('user_id', userId)
        .single();
      
      userContext = userPrefs;
    }
  } catch (error) {
    // Continue without user context if auth fails
    console.log('No user context available:', error);
  }
  
  // Use user preferences as intelligent defaults, but allow URL overrides
  const classLevel = searchParams.get('class') || userContext?.class_level;
  const subject = searchParams.get('subject');
  const boardType = searchParams.get('board') || userContext?.school_type || 'CBSE';
  const schoolId = searchParams.get('school');
  const streamId = searchParams.get('stream');
  const userStream = searchParams.get('userStream') === 'true' && userContext?.stream;
  
  // Auto-detect stream from user context if requested
  let effectiveStreamId = streamId;
  if (userStream && userContext?.stream) {
    // Map user stream name to stream ID
    try {
      const streamCode = getStreamCodeFromName(userContext.stream);
      if (streamCode) {
        const { data: streamData } = await supabase
          .from('streams')
          .select('id')
          .eq('code', streamCode)
          .single();
        
        if (streamData) {
          effectiveStreamId = streamData.id;
        }
      }
    } catch (error) {
      console.error('Error mapping user stream to ID:', error);
    }
  }
  const chapterNumber = searchParams.get('chapter');
  const exerciseName = searchParams.get('exercise');
  const questionType = searchParams.get('type');
  const difficulty = searchParams.get('difficulty');
  const includeExamples = searchParams.get('examples') === 'true';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  try {
    let query = supabase
      .from('school_question_summary')
      .select(`
        id,
        question_text,
        question_number,
        question_type,
        difficulty_level,
        is_example,
        page_number,
        topics,
        keywords,
        chapter_name,
        chapter_number,
        book_name,
        exercise_name,
        exercise_number,
        school_id,
        school_name,
        school_code,
        school_city,
        school_state,
        school_board_type,
        stream_id,
        stream_name,
        stream_code,
        subject_name,
        subject_code,
        subject_category
      `);

    // Apply filters
    if (classLevel) {
      query = query.eq('class_level', classLevel);
    }
    
    if (subject) {
      query = query.eq('subject', subject);
    }
    
    if (boardType) {
      query = query.eq('school_board_type', boardType); // Note: View column is school_board_type
    }
    
    // New school and stream filters
    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }
    
    if (effectiveStreamId) {
      query = query.eq('stream_id', effectiveStreamId);
    }
    
    if (chapterNumber) {
      query = query.eq('chapter_number', parseInt(chapterNumber));
    }
    
    if (exerciseName) {
      query = query.eq('exercise_name', exerciseName);
    }
    
    if (questionType) {
      query = query.eq('question_type', questionType);
    }
    
    if (difficulty) {
      query = query.eq('difficulty_level', difficulty);
    }
    
    if (!includeExamples) {
      query = query.eq('is_example', false);
    }
    
    // Order by display_order, then question_number
    query = query
      .order('chapter_number')
      .order('display_order')
      .order('question_number')
      .range(offset, offset + limit - 1);
    
    const { data: questions, error } = await query;
    
    if (error) {
      console.error('Error fetching questions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch questions', details: error.message },
        { status: 500 }
      );
    }
    
    // Group questions by chapter for better organization
    const questionsByChapter = questions?.reduce((acc, question) => {
      const chapterKey = `${question.chapter_number}-${question.chapter_name}`;
      if (!acc[chapterKey]) {
        acc[chapterKey] = {
          chapter_number: question.chapter_number,
          chapter_name: question.chapter_name,
          school_name: question.school_name,
          stream_name: question.stream_name,
          questions: []
        };
      }
      acc[chapterKey].questions.push(question);
      return acc;
    }, {} as Record<string, any>) || {};
    
    // Extract school and stream information from first question for metadata
    const firstQuestion = questions?.[0];
    const schoolInfo = firstQuestion ? {
      id: firstQuestion.school_id,
      name: firstQuestion.school_name,
      code: firstQuestion.school_code,
      city: firstQuestion.school_city,
      state: firstQuestion.school_state,
      school_type: firstQuestion.school_board_type
    } : null;
    
    const streamInfo = firstQuestion ? {
      id: firstQuestion.stream_id,
      name: firstQuestion.stream_name,
      code: firstQuestion.stream_code
    } : null;
    
    const response = {
      questions: questions || [],
      questionsByChapter,
      schoolInfo,
      streamInfo,
      total: questions?.length || 0,
      userContext: userContext ? {
        hasPreferences: true,
        schoolBoard: userContext.school_type,
        classLevel: userContext.class_level,
        stream: userContext.stream,
        filtersApplied: {
          boardFromUser: !searchParams.get('board') && userContext.school_type,
          classFromUser: !searchParams.get('class') && userContext.class_level,
          streamFromUser: userStream
        }
      } : {
        hasPreferences: false,
        filtersApplied: {}
      },
      filters: {
        classLevel,
        subject,
        boardType,
        schoolId,
        streamId: effectiveStreamId,
        chapterNumber,
        exerciseName,
        questionType,
        difficulty,
        includeExamples,
        limit,
        offset,
        userStream
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unexpected error in questions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to map stream names to codes
function getStreamCodeFromName(streamName: string): string | null {
  const streamMap: Record<string, string> = {
    'Science Medical': 'SCI_MED',
    'Science Non-Medical': 'SCI_NONMED',
    'Commerce': 'COM',
    'Arts': 'HUM',
    'Humanities': 'HUM'
  };
  
  return streamMap[streamName] || null;
}