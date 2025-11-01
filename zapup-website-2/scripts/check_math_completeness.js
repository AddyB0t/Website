require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeMathData() {
  try {
    console.log('\n=== ANALYZING MATHEMATICS QUESTIONS (Classes 9-12) ===\n');

    // Get all math questions for classes 9-12
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', 'Mathematics')
      .in('class_id', ['9', '10', '11', '12'])
      .order('class_id', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      return;
    }

    console.log('Total Questions Found: ' + questions.length + '\n');

    // Group by class
    const byClass = {};
    questions.forEach(q => {
      const classKey = 'Class ' + q.class_id;
      if (!byClass[classKey]) byClass[classKey] = [];
      byClass[classKey].push(q);
    });

    // Summary by class
    console.log('--- QUESTIONS BY CLASS ---');
    Object.keys(byClass).sort().forEach((className) => {
      const qs = byClass[className];
      console.log('\n' + className + ': ' + qs.length + ' questions');

      const completeness = { hasAnswer: 0, noAnswer: 0, hasExplanation: 0 };

      qs.forEach(q => {
        if (q.answer && q.answer.trim().length > 5) {
          completeness.hasAnswer++;
        } else {
          completeness.noAnswer++;
        }

        if (q.explanation && q.explanation.trim().length > 5) {
          completeness.hasExplanation++;
        }
      });

      console.log('  With Answer: ' + completeness.hasAnswer);
      console.log('  Without Answer: ' + completeness.noAnswer);
      console.log('  With Explanation: ' + completeness.hasExplanation);
    });

    // List incomplete questions (no answer)
    const incomplete = questions.filter(q =>
      !q.answer || q.answer.trim().length < 5
    );

    console.log('\n\n=== QUESTIONS WITHOUT ANSWERS ===\n');
    console.log('Total: ' + incomplete.length + '\n');

    if (incomplete.length > 0) {
      console.log('First 15 incomplete questions:\n');
      incomplete.slice(0, 15).forEach((q, i) => {
        console.log((i+1) + '. Class ' + q.class_id + ' | ' + q.chapter + ' | ' + (q.section || 'N/A'));
        console.log('   Question ' + q.question_number + ': ' + q.text.substring(0, 80) + '...');
        console.log('   ID: ' + q.id);
        console.log('');
      });

      if (incomplete.length > 15) {
        console.log('\n... and ' + (incomplete.length - 15) + ' more incomplete questions\n');
      }
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

analyzeMathData();
