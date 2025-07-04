import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock data to use if Supabase connection fails
const mockSubjects = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Numbers, algebra, geometry, and more with interactive lessons tailored for Class 6 students.',
    icon: 'calculator'
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Introduction to physics, chemistry, and biology concepts suitable for Class 6 curriculum.',
    icon: 'flask'
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    description: 'Explore history, geography, and civics topics from the Class 6 syllabus.',
    icon: 'globe'
  },
  {
    id: 'english',
    name: 'English',
    description: 'Reading, writing, and communication skills through Class 6 literature and language exercises.',
    icon: 'book'
  },
  {
    id: 'hindi',
    name: 'Hindi',
    description: 'Develop Hindi language skills through stories and activities designed for Class 6.',
    icon: 'language'
  },
  {
    id: 'computer',
    name: 'Computer Studies / Applications',
    description: 'Basic computer concepts and skills appropriate for Class 6 students.',
    icon: 'laptop'
  },
  {
    id: 'scholastic',
    name: 'Scholastic',
    description: 'Life skills through environmental studies and general knowledge for Class 6.',
    icon: 'school'
  },
  {
    id: 'art',
    name: 'Art & Craft',
    description: 'Creative projects and activities suitable for Class 6 students.',
    icon: 'palette'
  }
];

export async function GET() {
  try {
    // Try to get data from Supabase
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');

    // If there's an error or no data, return mock data
    if (error || !data || data.length === 0) {
      console.log('Using mock subjects data');
      return NextResponse.json(mockSubjects);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    console.log('Using mock subjects data after error');
    return NextResponse.json(mockSubjects);
  }
} 