import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const classLevel = searchParams.get('class');
  const boardType = searchParams.get('board') || 'CBSE';
  
  if (!classLevel) {
    return NextResponse.json(
      { error: 'Class level is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get available subjects for the class by checking which subjects have books with chapters and questions
    const { data: availableSubjects, error } = await supabase
      .from('books')
      .select(`
        subject_id,
        subjects!inner(name),
        chapters(id, total_questions)
      `)
      .eq('class_level', classLevel)
      .eq('school_type', boardType)
      .not('chapters', 'is', null);
    
    if (error) {
      console.error('Error fetching available subjects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch available subjects' },
        { status: 500 }
      );
    }

    // Process the data to get unique subjects with question counts
    const subjectData = availableSubjects.reduce((acc: Record<string, { subject: string, totalQuestions: number, totalChapters: number }>, book) => {
      const subject = book.subjects?.name?.toLowerCase();
      
      // Skip books without proper subject data
      if (!subject) {
        console.warn('Book missing subject data:', book);
        return acc;
      }
      
      if (!acc[subject]) {
        acc[subject] = {
          subject: subject,
          totalQuestions: 0,
          totalChapters: 0
        };
      }
      
      // Count chapters and questions for this subject
      if (book.chapters) {
        acc[subject].totalChapters += book.chapters.length;
        acc[subject].totalQuestions += book.chapters.reduce((sum, chapter) => sum + (chapter.total_questions || 0), 0);
      }
      
      return acc;
    }, {});

    // Convert to array and filter out subjects with no questions
    let availableSubjectsList = Object.values(subjectData)
      .filter(subject => subject.totalQuestions > 0)
      .map(subject => ({
        ...subject,
        available: true
      }));

    // FALLBACK: If no subjects found in books/chapters, check question_availability table
    if (availableSubjectsList.length === 0) {
      console.log('No subjects found in books/chapters, checking question_availability table...');
      
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('question_availability')
        .select('class_id, subject, question_count, is_available')
        .eq('class_id', classLevel)
        .eq('is_available', true)
        .gt('question_count', 0);
      
      if (!availabilityError && availabilityData && availabilityData.length > 0) {
        console.log('Found subjects in question_availability table:', availabilityData);
        
        // Group by subject and sum question counts
        const availabilitySubjects = availabilityData.reduce((acc: Record<string, any>, item) => {
          const subject = item.subject.toLowerCase();
          if (!acc[subject]) {
            acc[subject] = {
              subject: subject,
              totalQuestions: 0,
              totalChapters: 0
            };
          }
          acc[subject].totalQuestions += item.question_count;
          acc[subject].totalChapters += 1; // Count each availability record as a chapter
          return acc;
        }, {});
        
        availableSubjectsList = Object.values(availabilitySubjects).map(subject => ({
          ...subject,
          available: true
        }));
        
        console.log('Using question_availability data:', availableSubjectsList);
      }
    }

    return NextResponse.json({
      classLevel,
      boardType,
      availableSubjects: availableSubjectsList
    });
    
  } catch (error) {
    console.error('Unexpected error in available-subjects API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}