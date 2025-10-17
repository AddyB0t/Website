#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  console.log('Deleting Class 9 data...');

  // Get all Class 9 books
  const { data: books } = await supabase
    .from('books')
    .select('id')
    .eq('class_level', '9');

  if (!books || books.length === 0) {
    console.log('No Class 9 books found');
    return;
  }

  const bookIds = books.map(b => b.id);

  // Get all chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id')
    .in('book_id', bookIds);

  if (chapters && chapters.length > 0) {
    const chapterIds = chapters.map(c => c.id);

    // Get all exercises
    const { data: exercises } = await supabase
      .from('exercises')
      .select('id')
      .in('chapter_id', chapterIds);

    if (exercises && exercises.length > 0) {
      const exerciseIds = exercises.map(e => e.id);

      // Delete questions
      const { error: qError } = await supabase
        .from('questions')
        .delete()
        .in('exercise_id', exerciseIds);

      if (qError) console.error('Error deleting questions:', qError);
      else console.log(`Deleted questions for ${exerciseIds.length} exercises`);
    }

    // Delete exercises
    const { error: eError } = await supabase
      .from('exercises')
      .delete()
      .in('chapter_id', chapterIds);

    if (eError) console.error('Error deleting exercises:', eError);
    else console.log(`Deleted exercises for ${chapterIds.length} chapters`);
  }

  // Delete chapters
  const { error: cError } = await supabase
    .from('chapters')
    .delete()
    .in('book_id', bookIds);

  if (cError) console.error('Error deleting chapters:', cError);
  else console.log(`Deleted chapters for ${bookIds.length} books`);

  // Delete books
  const { error: bError } = await supabase
    .from('books')
    .delete()
    .eq('class_level', '9');

  if (bError) console.error('Error deleting books:', bError);
  else console.log(`Deleted ${bookIds.length} books`);

  console.log('Done!');
})();
