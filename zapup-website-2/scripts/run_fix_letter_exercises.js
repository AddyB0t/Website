#!/usr/bin/env node
/**
 * Fix display_order for letter-based exercises (Exercise A, B, C, D, etc.)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixLetterExercises() {
  console.log('='.repeat(80));
  console.log('FIXING LETTER-BASED EXERCISES');
  console.log('='.repeat(80));

  const updates = [
    { letter: 'A', displayOrder: 100, number: 1 },
    { letter: 'B', displayOrder: 200, number: 2 },
    { letter: 'C', displayOrder: 300, number: 3 },
    { letter: 'D', displayOrder: 400, number: 4 },
    { letter: 'E', displayOrder: 500, number: 5 },
    { letter: 'F', displayOrder: 600, number: 6 },
  ];

  for (const update of updates) {
    console.log(`\nUpdating Exercise ${update.letter}...`);

    // First get all exercises with this name and display_order = 0
    const { data: exercisesToUpdate, error: fetchError } = await supabase
      .from('exercises')
      .select('id')
      .ilike('name', `Exercise ${update.letter}`)
      .eq('display_order', 0);

    if (fetchError) {
      console.error(`❌ Error fetching Exercise ${update.letter}:`, fetchError);
      continue;
    }

    if (!exercisesToUpdate || exercisesToUpdate.length === 0) {
      console.log(`  No exercises found with display_order = 0`);
      continue;
    }

    console.log(`  Found ${exercisesToUpdate.length} exercises to update`);

    // Update each exercise
    const exerciseIds = exercisesToUpdate.map(e => e.id);
    const { data, error } = await supabase
      .from('exercises')
      .update({
        display_order: update.displayOrder,
        exercise_number: update.number,
        updated_at: new Date().toISOString()
      })
      .in('id', exerciseIds)
      .select('id, name');

    if (error) {
      console.error(`❌ Error updating Exercise ${update.letter}:`, error);
    } else {
      console.log(`✅ Updated ${data?.length || 0} exercises for Exercise ${update.letter}`);
    }
  }

  // Verification
  console.log('\n' + '='.repeat(80));
  console.log('VERIFICATION - Sample of updated exercises');
  console.log('='.repeat(80));

  // Get some books for Class 11
  const { data: books } = await supabase
    .from('books')
    .select('id')
    .eq('class_level', '11')
    .limit(5);

  if (books && books.length > 0) {
    const bookIds = books.map(b => b.id);

    // Get chapters
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, title')
      .in('book_id', bookIds)
      .limit(3);

    if (chapters && chapters.length > 0) {
      for (const chapter of chapters) {
        const { data: exercises } = await supabase
          .from('exercises')
          .select('name, exercise_number, display_order')
          .eq('chapter_id', chapter.id)
          .order('display_order');

        if (exercises && exercises.length > 0) {
          console.log(`\n${chapter.title}:`);
          exercises.forEach(ex => {
            console.log(`  ${ex.name} (number: ${ex.exercise_number}, display_order: ${ex.display_order})`);
          });
        }
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ DONE! All letter-based exercises updated.');
  console.log('='.repeat(80));
}

fixLetterExercises().catch(console.error);
