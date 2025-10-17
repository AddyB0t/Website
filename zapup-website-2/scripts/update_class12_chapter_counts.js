const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateClass12ChapterCounts() {
  console.log('🔄 Updating chapter question counts for Class 12...\n');

  const { data: books } = await supabase
    .from('books')
    .select('id, title, subjects(name)')
    .eq('class_level', '12');

  if (!books || books.length === 0) {
    console.log('No Class 12 books found');
    return;
  }

  let totalUpdated = 0;

  for (const book of books) {
    const subjectName = book.subjects?.name || 'Unknown';
    console.log(`📚 ${subjectName}`);

    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, title')
      .eq('book_id', book.id);

    if (!chapters || chapters.length === 0) {
      console.log('  No chapters found');
      continue;
    }

    for (const chapter of chapters) {
      const { data: exercises } = await supabase
        .from('exercises')
        .select('id')
        .eq('chapter_id', chapter.id);

      if (!exercises || exercises.length === 0) {
        continue;
      }

      const exerciseIds = exercises.map(e => e.id);

      const { count: questionCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .in('exercise_id', exerciseIds)
        .eq('is_active', true);

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

  console.log(`\n✅ Updated ${totalUpdated} chapters`);
}

updateClass12ChapterCounts().catch(console.error);
