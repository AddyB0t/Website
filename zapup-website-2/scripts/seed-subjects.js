require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sampleSubjects = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Explore numbers, geometry, algebra and more',
    icon: 'calculator'
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Discover physics, chemistry, biology and natural phenomena',
    icon: 'flask'
  },
  {
    id: 'english',
    name: 'English',
    description: 'Develop language skills, literature analysis and writing',
    icon: 'book'
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    description: 'Learn history, geography, civics and cultures',
    icon: 'globe'
  },
  {
    id: 'computer',
    name: 'Computer Science',
    description: 'Explore programming, algorithms and digital technology',
    icon: 'laptop'
  }
];

async function seedSubjects() {
  try {
    console.log('Seeding subjects...');
    
    // Insert subjects
    const { data, error } = await supabase
      .from('subjects')
      .upsert(sampleSubjects, { onConflict: 'id' });
    
    if (error) {
      throw error;
    }
    
    console.log('Successfully seeded subjects!');
  } catch (error) {
    console.error('Error seeding subjects:', error);
  } finally {
    process.exit(0);
  }
}

seedSubjects(); 