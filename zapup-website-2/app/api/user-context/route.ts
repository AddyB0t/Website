import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from Clerk authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Fetch user preferences
    const { data: userPreferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select(`
        user_id,
        email,
        first_name,
        last_name,
        school_type,
        class_level,
        stream,
        profile_complete,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .single();
    
    if (prefsError && prefsError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching user preferences:', prefsError);
      return NextResponse.json(
        { error: 'Failed to fetch user preferences', details: prefsError.message },
        { status: 500 }
      );
    }
    
    // If no preferences found, return minimal context
    if (!userPreferences) {
      return NextResponse.json({
        user: {
          id: userId,
          hasPreferences: false,
          profileComplete: false
        },
        academicContext: null,
        availableOptions: {
          boards: ['CBSE (Central Board of Secondary Education)', 'ICSE (Indian Certificate of Secondary Education)'],
          classes: ['6', '7', '8', '9', '10', '11', '12'],
          streams: ['Science Medical', 'Science Non-Medical', 'Commerce', 'Arts', 'Humanities']
        }
      });
    }
    
    // Get available subjects for user's class and stream context
    let availableSubjects = [];
    if (userPreferences.class_level) {
      try {
        // For classes 11-12 with streams, get stream-specific subjects
        if (['11', '12'].includes(userPreferences.class_level) && userPreferences.stream) {
          const streamCode = getStreamCode(userPreferences.stream);
          if (streamCode) {
            const { data: streamSubjects } = await supabase
              .from('stream_subjects_view')
              .select(`
                subject_id,
                subject_name,
                subject_code,
                subject_category,
                is_mandatory,
                is_elective
              `)
              .eq('stream_code', streamCode)
              .contains('class_levels', [userPreferences.class_level])
              .limit(20); // Safe limit: 2x max subjects per stream (max is 9)
            
            availableSubjects = streamSubjects || [];
          }
        } else {
          // For classes 6-10, get general subjects
          const { data: generalSubjects } = await supabase
            .from('subjects')
            .select(`
              id,
              name,
              subject_code,
              subject_category
            `)
            .contains('applicable_classes', [userPreferences.class_level])
            .in('subject_category', ['Core', 'Elective'])
            .limit(15); // Safe limit: 3x max subjects for classes 6-10 (max is 5)
          
          availableSubjects = generalSubjects?.map(s => ({
            subject_id: s.id,
            subject_name: s.name,
            subject_code: s.subject_code,
            subject_category: s.subject_category,
            is_mandatory: s.subject_category === 'Core',
            is_elective: s.subject_category === 'Elective'
          })) || [];
        }
      } catch (error) {
        console.error('Error fetching available subjects:', error);
      }
    }
    
    // Get available schools for user's board and potential location
    let suggestedSchools = [];
    if (userPreferences.school_type) {
      try {
        const { data: schools } = await supabase
          .from('schools')
          .select('id, name, code, city, state, school_type')
          .eq('school_type', userPreferences.school_type)
          .order('name')
          .limit(20);
        
        suggestedSchools = schools || [];
      } catch (error) {
        console.error('Error fetching suggested schools:', error);
      }
    }
    
    // Check if user has questions available for their context
    let hasQuestionsAvailable = false;
    if (userPreferences.class_level && userPreferences.school_type) {
      try {
        const { data: questionCheck } = await supabase
          .from('school_question_summary')
          .select('id')
          .eq('class_level', userPreferences.class_level)
          .eq('school_type', userPreferences.school_type)
          .limit(1);
        
        hasQuestionsAvailable = (questionCheck?.length || 0) > 0;
      } catch (error) {
        console.error('Error checking question availability:', error);
      }
    }
    
    const response = {
      user: {
        id: userId,
        email: userPreferences.email,
        name: `${userPreferences.first_name || ''} ${userPreferences.last_name || ''}`.trim(),
        hasPreferences: true,
        profileComplete: userPreferences.profile_complete
      },
      academicContext: {
        schoolType: userPreferences.school_type,
        classLevel: userPreferences.class_level,
        stream: userPreferences.stream,
        isStreamRequired: ['11', '12'].includes(userPreferences.class_level || ''),
        hasQuestionsAvailable
      },
      availableSubjects: {
        count: availableSubjects.length,
        subjects: availableSubjects,
        mandatory: availableSubjects.filter(s => s.is_mandatory),
        elective: availableSubjects.filter(s => s.is_elective)
      },
      suggestedSchools: {
        count: suggestedSchools.length,
        schools: suggestedSchools
      },
      availableOptions: {
        boards: ['CBSE (Central Board of Secondary Education)', 'ICSE (Indian Certificate of Secondary Education)'],
        classes: ['6', '7', '8', '9', '10', '11', '12'],
        streams: ['Science Medical', 'Science Non-Medical', 'Commerce', 'Arts', 'Humanities']
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unexpected error in user-context API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to map stream names to codes
function getStreamCode(streamName: string): string | null {
  const streamMap: Record<string, string> = {
    'Science Medical': 'SCI_MED',
    'Science Non-Medical': 'SCI_NONMED',
    'Commerce': 'COM',
    'Arts': 'HUM',
    'Humanities': 'HUM'
  };
  
  return streamMap[streamName] || null;
}

// PATCH endpoint to update user context/preferences
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    const updates = await request.json();
    
    // Validate the updates
    const allowedUpdates = ['school_type', 'class_level', 'stream', 'first_name', 'last_name'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as Record<string, any>);
    
    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }
    
    // Update user preferences
    const { data: updatedPrefs, error } = await supabase
      .from('user_preferences')
      .update({
        ...filteredUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user preferences:', error);
      return NextResponse.json(
        { error: 'Failed to update user preferences', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      updatedFields: Object.keys(filteredUpdates),
      preferences: updatedPrefs
    });
    
  } catch (error) {
    console.error('Unexpected error in user-context PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}