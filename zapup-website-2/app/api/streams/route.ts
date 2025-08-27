import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const classLevel = searchParams.get('class');
  const withSubjects = searchParams.get('subjects') === 'true';
  const streamCode = searchParams.get('code');
  
  try {
    // Get streams with their subjects
    let query = supabase
      .from('stream_subjects_view')
      .select(`
        stream_id,
        stream_name,
        stream_code,
        class_levels,
        subject_id,
        subject_name,
        subject_code,
        subject_category,
        is_mandatory,
        is_elective
      `);
    
    // Apply filters
    if (streamCode) {
      query = query.eq('stream_code', streamCode);
    }
    
    if (classLevel) {
      query = query.contains('class_levels', [classLevel]);
    }
    
    query = query.order('stream_name').order('is_mandatory', { ascending: false }).order('subject_name');
    
    const { data: streamSubjects, error } = await query;
    
    if (error) {
      console.error('Error fetching streams:', error);
      return NextResponse.json(
        { error: 'Failed to fetch streams', details: error.message },
        { status: 500 }
      );
    }
    
    // Group by streams if withSubjects is requested
    const streams = streamSubjects?.reduce((acc, item) => {
      const streamKey = item.stream_id;
      
      if (!acc[streamKey]) {
        acc[streamKey] = {
          id: item.stream_id,
          name: item.stream_name,
          code: item.stream_code,
          class_levels: item.class_levels,
          subjects: []
        };
      }
      
      if (withSubjects) {
        acc[streamKey].subjects.push({
          id: item.subject_id,
          name: item.subject_name,
          code: item.subject_code,
          category: item.subject_category,
          is_mandatory: item.is_mandatory,
          is_elective: item.is_elective
        });
      }
      
      return acc;
    }, {} as Record<string, any>) || {};
    
    // Convert to array
    const streamsArray = Object.values(streams);
    
    // If not requesting subjects, get basic stream info
    if (!withSubjects) {
      const { data: basicStreams, error: basicError } = await supabase
        .from('streams')
        .select('id, name, code, class_levels, description')
        .order('name');
      
      if (basicError) {
        console.error('Error fetching basic streams:', basicError);
        return NextResponse.json(
          { error: 'Failed to fetch streams', details: basicError.message },
          { status: 500 }
        );
      }
      
      const response = {
        streams: basicStreams || [],
        total: basicStreams?.length || 0,
        filters: {
          classLevel,
          streamCode,
          withSubjects
        }
      };
      
      return NextResponse.json(response);
    }
    
    const response = {
      streams: streamsArray,
      total: streamsArray.length,
      filters: {
        classLevel,
        streamCode,
        withSubjects
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unexpected error in streams API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Endpoint to get subjects for a specific stream
export async function POST(request: NextRequest) {
  try {
    const { streamId, streamCode } = await request.json();
    
    if (!streamId && !streamCode) {
      return NextResponse.json(
        { error: 'Stream ID or stream code is required' },
        { status: 400 }
      );
    }
    
    let query = supabase
      .from('stream_subjects_view')
      .select(`
        subject_id,
        subject_name,
        subject_code,
        subject_category,
        is_mandatory,
        is_elective,
        stream_name,
        stream_code
      `);
    
    if (streamId) {
      query = query.eq('stream_id', streamId);
    } else if (streamCode) {
      query = query.eq('stream_code', streamCode);
    }
    
    query = query.order('is_mandatory', { ascending: false }).order('subject_name');
    
    const { data: subjects, error } = await query;
    
    if (error) {
      console.error('Error fetching stream subjects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stream subjects', details: error.message },
        { status: 500 }
      );
    }
    
    const response = {
      subjects: subjects || [],
      stream: subjects?.[0] ? {
        name: subjects[0].stream_name,
        code: subjects[0].stream_code
      } : null,
      total: subjects?.length || 0
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unexpected error in stream subjects API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}