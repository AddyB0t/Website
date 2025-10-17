#!/usr/bin/env node
/**
 * Check exercise names and display_order for Class 11 Mathematics Chapter 1
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkExercises() {
  console.log('Checking exercises for Class 11 Mathematics Chapter 1: Sets');
  console.log('='.repeat(80));

  // Get the book
  const { data: books } = await supabase
    .from('books')
    .select('id, subjects!inner(name)')
    .eq('class_level', '11')
    .ilike('subjects.name', 'mathematics');

  if (!books || books.length === 0) {
    console.log('No books found');
    return;
  }

  const bookIds = books.map(b => b.id);

  // Get Chapter 1: Sets
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title')
    .in('book_id', bookIds)
    .ilike('title', '%Chapter 1%Sets%');

  if (!chapters || chapters.length === 0) {
    console.log('No chapters found');
    return;
  }

  console.log(`Found ${chapters.length} chapter(s):`);
  chapters.forEach(ch => console.log(`  - ${ch.title} (ID: ${ch.id})`));

  const chapterIds = chapters.map(c => c.id);

  // Get exercises
  const { data: exercises } = await supabase
    .from('exercises')
    .select('id, name, exercise_number, display_order, chapter_id')
    .in('chapter_id', chapterIds)
    .order('display_order');

  console.log('\nExercises:');
  console.log('-'.repeat(80));
  exercises.forEach(ex => {
    console.log(`${ex.name}`);
    console.log(`  ID: ${ex.id}`);
    console.log(`  exercise_number: ${ex.exercise_number}`);
    console.log(`  display_order: ${ex.display_order}`);
    console.log('');
  });

  // Check a few more chapters
  const { data: allChapters } = await supabase
    .from('chapters')
    .select('id, title')
    .in('book_id', bookIds)
    .limit(5);

  console.log('\nSample exercises from first 5 chapters:');
  console.log('='.repeat(80));

  for (const chapter of allChapters) {
    const { data: chExercises } = await supabase
      .from('exercises')
      .select('name, display_order')
      .eq('chapter_id', chapter.id)
      .order('display_order')
      .limit(5);

    if (chExercises && chExercises.length > 0) {
      console.log(`\n${chapter.title}:`);
      chExercises.forEach(ex => {
        console.log(`  ${ex.name} (display_order: ${ex.display_order})`);
      });
    }
  }
}

checkExercises().catch(console.error);
