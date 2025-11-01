require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupIncompleteQuestions() {
  try {
    console.log('\n=== INCOMPLETE QUESTIONS CLEANUP ===\n');

    // Get all incomplete questions (no answer)
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, class_id, subject, chapter, question_number, answer')
      .eq('subject', 'Mathematics')
      .in('class_id', ['9', '10', '11', '12'])
      .or('answer.is.null,answer.eq.');

    if (error) {
      console.error('Error fetching questions:', error);
      return;
    }

    console.log('Found ' + questions.length + ' incomplete Mathematics questions\n');

    // Group by class
    const byClass = {};
    questions.forEach(q => {
      const classKey = 'Class ' + q.class_id;
      if (!byClass[classKey]) byClass[classKey] = [];
      byClass[classKey].push(q);
    });

    console.log('--- BREAKDOWN BY CLASS ---\n');
    Object.keys(byClass).sort().forEach(className => {
      console.log(className + ': ' + byClass[className].length + ' incomplete questions');
    });

    // Show deletion options
    console.log('\n--- DELETION OPTIONS ---\n');
    console.log('To delete incomplete questions, uncomment the code below:\n');

    // Prepare deletion script (commented out for safety)
    console.log('/* Uncomment to delete all incomplete Math questions:\n');
    console.log('const { error: deleteError } = await supabase');
    console.log('  .from("questions")');
    console.log('  .delete()');
    console.log('  .eq("subject", "Mathematics")');
    console.log('  .in("class_id", ["9", "10", "11", "12"])');
    console.log('  .or("answer.is.null,answer.eq.");\n');
    console.log('if (deleteError) {');
    console.log('  console.error("Deletion error:", deleteError);');
    console.log('} else {');
    console.log('  console.log("Deleted " + questions.length + " incomplete questions");');
    console.log('}');
    console.log('*/\n');

    console.log('SAFETY NOTE: Run this script manually after reviewing the numbers above.\n');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

cleanupIncompleteQuestions();
