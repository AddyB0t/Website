import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const classLevel = searchParams.get('class');
  const subject = searchParams.get('subject');
  const boardType = searchParams.get('board') || 'CBSE';
  const schoolId = searchParams.get('school');
  const streamId = searchParams.get('stream');
  
  try {
    // Get enhanced statistics with school and stream support
    let statsQuery = supabase.from('class_subject_stream_stats').select('*');
    
    if (classLevel) {
      statsQuery = statsQuery.eq('class_level', classLevel);
    }
    if (subject) {
      statsQuery = statsQuery.eq('subject', subject);
    }
    if (boardType) {
      statsQuery = statsQuery.eq('school_type', boardType);
    }
    
    const { data: stats, error: statsError } = await statsQuery;
    
    // Get school-specific statistics
    let schoolStatsQuery = supabase.from('school_stats').select('*');
    
    if (schoolId) {
      schoolStatsQuery = schoolStatsQuery.eq('school_id', schoolId);
    }
    if (boardType) {
      schoolStatsQuery = schoolStatsQuery.eq('school_type', boardType);
    }
    
    const { data: schoolStats, error: schoolStatsError } = await schoolStatsQuery;
    
    if (statsError) {
      console.error('Error fetching stats:', statsError);
      return NextResponse.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      );
    }
    
    // Get available books for the filtered criteria with school and stream info
    let booksQuery = supabase
      .from('books')
      .select(`
        id,
        name,
        class_level,
        subjects!inner(name),
        school_type,
        author,
        publisher,
        edition,
        publication_year,
        language,
        school_id,
        stream_id,
        schools(id, name, code, city, state, school_type),
        streams(id, name, code, class_levels)
      `);
    
    if (classLevel) {
      booksQuery = booksQuery.eq('class_level', classLevel);
    }
    if (subject) {
      booksQuery = booksQuery.eq('subjects.name', subject);
    }
    if (boardType) {
      booksQuery = booksQuery.eq('school_type', boardType);
    }
    if (schoolId) {
      booksQuery = booksQuery.eq('school_id', schoolId);
    }
    if (streamId) {
      booksQuery = booksQuery.eq('stream_id', streamId);
    }
    
    const { data: books, error: booksError } = await booksQuery
      .order('class_level')
      .order('name');
    
    if (booksError) {
      console.error('Error fetching books:', booksError);
      return NextResponse.json(
        { error: 'Failed to fetch books' },
        { status: 500 }
      );
    }
    
    // Get available chapters for the books
    let chaptersQuery = supabase
      .from('chapters')
      .select(`
        id,
        book_id,
        chapter_number,
        chapter_name,
        total_questions,
        total_examples,
        books!inner(
          class_level, 
          school_type, 
          title,
          subjects!inner(name)
        )
      `);
    
    // Filter chapters based on the same criteria
    if (classLevel) {
      chaptersQuery = chaptersQuery.eq('books.class_level', classLevel);
    }
    if (subject) {
      chaptersQuery = chaptersQuery.eq('books.subjects.name', subject);
    }
    if (boardType) {
      chaptersQuery = chaptersQuery.eq('books.school_type', boardType);
    }
    
    const { data: chapters, error: chaptersError } = await chaptersQuery
      .order('books.class_level')
      .order('books.name')
      .order('chapter_number');
    
    if (chaptersError) {
      console.error('Error fetching chapters:', chaptersError);
      return NextResponse.json(
        { error: 'Failed to fetch chapters' },
        { status: 500 }
      );
    }
    
    // Get unique question types and difficulties available with school context
    let filtersQuery = supabase
      .from('school_question_summary')
      .select('question_type, difficulty_level, exercise_name, school_name, stream_name');
    
    if (classLevel) {
      filtersQuery = filtersQuery.eq('class_level', classLevel);
    }
    if (subject) {
      filtersQuery = filtersQuery.eq('subject', subject);
    }
    if (boardType) {
      filtersQuery = filtersQuery.eq('school_type', boardType);
    }
    if (schoolId) {
      filtersQuery = filtersQuery.eq('school_id', schoolId);
    }
    if (streamId) {
      filtersQuery = filtersQuery.eq('stream_id', streamId);
    }
    
    const { data: filterData, error: filtersError } = await filtersQuery;
    
    if (filtersError) {
      console.error('Error fetching filters:', filtersError);
      return NextResponse.json(
        { error: 'Failed to fetch filter options' },
        { status: 500 }
      );
    }
    
    // Get streams data for the response
    let streamsQuery = supabase
      .from('stream_subjects_view')
      .select('*');
    
    if (streamId) {
      streamsQuery = streamsQuery.eq('stream_id', streamId);
    }
    
    const { data: streamsData, error: streamsError } = await streamsQuery;
    
    // Extract unique values for filters
    const questionTypes = [...new Set(filterData?.map(d => d.question_type).filter(Boolean))];
    const difficulties = [...new Set(filterData?.map(d => d.difficulty_level).filter(Boolean))];
    const exercises = [...new Set(filterData?.map(d => d.exercise_name).filter(Boolean))];
    const schools = [...new Set(filterData?.map(d => d.school_name).filter(Boolean))];
    const streams = [...new Set(filterData?.map(d => d.stream_name).filter(Boolean))];
    
    // Enhanced subjects list including stream-specific subjects
    const enhancedSubjects = [
      // Classes 6-10 subjects
      'mathematics', 'science', 'english', 'social-studies',
      // Science stream subjects (11-12)
      'physics', 'chemistry', 'biology', 'english-core', 'computer-science', 'mathematics-advanced',
      // Commerce stream subjects (11-12)
      'accountancy', 'business-studies', 'economics', 'mathematics-commerce',
      // Humanities stream subjects (11-12)
      'history', 'political-science', 'geography', 'sociology', 'psychology', 'philosophy',
      // Optional subjects
      'physical-education', 'fine-arts', 'hindi'
    ];
    
    const response = {
      statistics: stats || [],
      schoolStats: schoolStats || [],
      books: books || [],
      chapters: chapters || [],
      streams: streamsData || [],
      filterOptions: {
        questionTypes,
        difficulties,
        exercises,
        schools,
        streams
      },
      availableClasses: ['6', '7', '8', '9', '10', '11', '12'],
      availableSubjects: enhancedSubjects,
      availableBoards: ['CBSE', 'ICSE'],
      availableStreams: [
        { code: 'SCI_MED', name: 'Science Medical', classes: ['11', '12'] },
        { code: 'SCI_NONMED', name: 'Science Non-Medical', classes: ['11', '12'] },
        { code: 'COM', name: 'Commerce', classes: ['11', '12'] },
        { code: 'HUM', name: 'Humanities', classes: ['11', '12'] }
      ]
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unexpected error in stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}