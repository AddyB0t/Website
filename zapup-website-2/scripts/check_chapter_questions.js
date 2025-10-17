const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/mnt/data/Website/zapup-website-2/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkChapters() {
  // Get Class 10 Mathematics book
  const { data: books } = await supabase
    .from('books')
    .select('id, title')
    .eq('class_id', 10)
    .eq('board', 'CBSE')
    .ilike('title', '%mathematics%');

  console.log('\n📚 Books found:', books?.length);
  if (books) {
    books.forEach(b => console.log('  -', b.title, '(ID:', b.id + ')'));
  }

  if (!books || books.length === 0) return;

  const bookIds = books.map(b => b.id);

  // Get chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, book_id')
    .in('book_id', bookIds)
    .or('title.ilike.%trigonometric%,title.ilike.%heights%,title.ilike.%distances%,title.ilike.%measures%,title.ilike.%probability%,title.ilike.%goods%,title.ilike.%services%,title.ilike.%tax%');

  console.log('\n📖 Chapters found:', chapters?.length);

  for (const chapter of chapters || []) {
    console.log('\n  Chapter:', chapter.title);

    // Get exercises for this chapter
    const { data: exercises } = await supabase
      .from('exercises')
      .select('id, name, exercise_number')
      .eq('chapter_id', chapter.id)
      .order('exercise_number');

    console.log('    Exercises:', exercises?.length);

    for (const exercise of exercises || []) {
      // Count questions
      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('exercise_id', exercise.id)
        .eq('is_active', true);

      console.log('      -', exercise.name, '→', count, 'questions');
    }
  }
}

checkChapters().catch(console.error);
