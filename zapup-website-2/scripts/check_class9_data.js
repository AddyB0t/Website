const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function checkClass9() {
  console.log('\n🔍 Checking Class 9 data...\n');

  // Check books
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('id, title, class_level, board, subjects(id, name)')
    .eq('class_level', '9');

  if (booksError) {
    console.error('❌ Error fetching books:', booksError);
  } else {
    console.log(`📚 Found ${books?.length || 0} books for Class 9`);
    books?.forEach(b => {
      console.log(`   - ${b.title} (Board: ${b.board}, Subject: ${b.subjects?.name || 'N/A'})`);
    });
  }

  // Check questions by subject
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('subject')
    .eq('class_id', 9)
    .eq('is_active', true);

  if (qError) {
    console.error('❌ Error fetching questions:', qError);
  } else {
    const subjects = {};
    questions?.forEach(q => {
      const subj = q.subject || 'Unknown';
      subjects[subj] = (subjects[subj] || 0) + 1;
    });

    console.log(`\n❓ Found ${questions?.length || 0} questions for Class 9`);
    console.log('\nQuestions by subject:');
    Object.entries(subjects).sort((a, b) => b[1] - a[1]).forEach(([subj, count]) => {
      console.log(`   ${subj}: ${count} questions`);
    });
  }
}

checkClass9().catch(console.error);
