import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const schoolType = searchParams.get('school');
  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const search = searchParams.get('search');
  const withStats = searchParams.get('stats') === 'true';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    // Choose the appropriate table/view based on whether stats are needed
    const tableName = withStats ? 'school_stats' : 'schools';
    
    let query = supabase.from(tableName).select(
      withStats ? `
        school_id,
        school_name,
        school_code,
        city,
        state,
        school_type,
        total_books,
        total_chapters,
        total_questions,
        total_exercises,
        total_examples,
        total_streams,
        total_subjects
      ` : `
        id,
        name,
        code,
        school_type,
        state,
        city,
        established_year,
        principal_name,
        contact_email,
        contact_phone,
        website,
        created_at
      `
    );

    // Apply filters
    if (schoolType) {
      query = query.eq('school_type', schoolType);
    }
    
    if (state) {
      query = query.eq('state', state);
    }
    
    if (city) {
      query = query.eq('city', city);
    }
    
    // Search functionality
    if (search) {
      const searchColumn = withStats ? 'school_name' : 'name';
      query = query.ilike(searchColumn, `%${search}%`);
    }
    
    // Ordering and pagination
    const orderColumn = withStats ? 'school_name' : 'name';
    query = query
      .order(orderColumn)
      .range(offset, offset + limit - 1);
    
    const { data: schools, error } = await query;
    
    if (error) {
      console.error('Error fetching schools:', error);
      return NextResponse.json(
        { error: 'Failed to fetch schools', details: error.message },
        { status: 500 }
      );
    }
    
    // Get available filter options if no specific filters are applied
    let filterOptions = {};
    if (!schoolType && !state && !city) {
      const { data: filterData } = await supabase
        .from('schools')
        .select('school_type, state, city');
      
      if (filterData) {
        filterOptions = {
          schoolTypes: [...new Set(filterData.map(d => d.school_type).filter(Boolean))],
          states: [...new Set(filterData.map(d => d.state).filter(Boolean))],
          cities: [...new Set(filterData.map(d => d.city).filter(Boolean))]
        };
      }
    }
    
    const response = {
      schools: schools || [],
      total: schools?.length || 0,
      filterOptions,
      pagination: {
        limit,
        offset,
        hasMore: schools?.length === limit
      },
      filters: {
        schoolType,
        state,
        city,
        search,
        withStats
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unexpected error in schools API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for specific school details
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not implemented' },
    { status: 501 }
  );
}