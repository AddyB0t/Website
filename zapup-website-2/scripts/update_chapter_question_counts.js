const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateChapterQuestionCounts() {
  console.log('🔄 Updating chapter question counts for Class 9...\n');

  // Get all Class 9 books
  const { data: books } = await supabase
    .from('books')
    .select('id, title, subjects(name)')
    .eq('class_level', '9');

  if (!books || books.length === 0) {
    console.log('No Class 9 books found');
    return;
  }

  let totalUpdated = 0;

  for (const book of books) {
    const subjectName = book.subjects?.name || 'Unknown';
    console.log(`\n📚 ${subjectName}`);

    // Get all chapters for this book
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, title')
      .eq('book_id', book.id);

    if (!chapters || chapters.length === 0) {
      console.log('  No chapters found');
      continue;
    }

    for (const chapter of chapters) {
      // Get all exercises for this chapter
      const { data: exercises } = await supabase
        .from('exercises')
        .select('id')
        .eq('chapter_id', chapter.id);

      if (!exercises || exercises.length === 0) {
        continue;
      }

      const exerciseIds = exercises.map(e => e.id);

      // Count total questions in this chapter
      const { count: questionCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .in('exercise_id', exerciseIds)
        .eq('is_active', true);

      // Update the chapter
      const { error: updateError } = await supabase
        .from('chapters')
        .update({
          total_questions: questionCount || 0,
          total_exercises: exercises.length
        })
        .eq('id', chapter.id);

      if (updateError) {
        console.error(`  ❌ Error updating ${chapter.title}:`, updateError.message);
      } else {
        console.log(`  ✓ ${chapter.title}: ${questionCount} questions, ${exercises.length} exercises`);
        totalUpdated++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Updated ${totalUpdated} chapters`);
  console.log('='.repeat(60));
}

updateChapterQuestionCounts().catch(console.error);
