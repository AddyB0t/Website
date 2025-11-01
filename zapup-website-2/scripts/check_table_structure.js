require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStructure() {
  try {
    // Get first question to see structure
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error);
      return;
    }

    if (questions && questions.length > 0) {
      console.log('=== QUESTIONS TABLE STRUCTURE ===\n');
      console.log(JSON.stringify(questions[0], null, 2));
      console.log('\n=== COLUMN NAMES ===');
      console.log(Object.keys(questions[0]).join(', '));
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkStructure();
