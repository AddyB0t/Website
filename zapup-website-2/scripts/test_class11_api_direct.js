#!/usr/bin/env node
/**
 * Test the updated Class 11 Mathematics API directly via Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testUpdatedAPI() {
  console.log('='.repeat(80));
  console.log('TESTING UPDATED CLASS 11 MATHEMATICS API LOGIC');
  console.log('='.repeat(80));

  const classId = '11';
  const subjectId = 'mathematics';

  // Step 1: Get books
  console.log('\n1. Getting books...');
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select(`
      id,
      subjects!inner(id, name)
    `)
    .eq('class_level', classId)
    .ilike('subjects.name', subjectId);

  if (booksError) {
    console.error('❌ Books Error:', booksError);
    return;
  }

  console.log(`✅ Found ${books.length} books`);

  // Step 2: Get chapters
  const bookIds = books.map(b => b.id);
  console.log('\n2. Getting chapters...');
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id, title, book_id')
    .in('book_id', bookIds);

  if (chaptersError) {
    console.error('❌ Chapters Error:', chaptersError);
    return;
  }

  console.log(`✅ Found ${chapters.length} chapters`);

  // Step 3: Get exercises
  const chapterIds = chapters.map(c => c.id);
  console.log('\n3. Getting exercises...');
  const { data: exercises, error: exercisesError } = await supabase
    .from('exercises')
    .select('id, name, exercise_number, display_order, chapter_id')
    .in('chapter_id', chapterIds);

  if (exercisesError) {
    console.error('❌ Exercises Error:', exercisesError);
    return;
  }

  console.log(`✅ Found ${exercises.length} exercises`);

  // Step 4: Count questions per exercise using aggregate
  console.log(`\n4. Counting questions for ${exercises.length} exercises...`);
  const questionCountsByExercise = new Map();

  const batchSize = 50;
  let totalQuestions = 0;
  for (let i = 0; i < exercises.length; i += batchSize) {
    const batch = exercises.slice(i, i + batchSize);

    const countPromises = batch.map(async (exercise) => {
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('exercise_id', exercise.id)
        .eq('is_active', true);

      if (error) {
        console.error(`❌ Error counting for exercise ${exercise.id}:`, error);
        return { id: exercise.id, count: 0 };
      }

      return { id: exercise.id, count: count || 0 };
    });

    const counts = await Promise.all(countPromises);
    counts.forEach(({ id, count }) => {
      questionCountsByExercise.set(id, count);
      totalQuestions += count;
    });

    console.log(`   Batch ${Math.floor(i / batchSize) + 1}: Processed ${batch.length} exercises`);
  }

  console.log(`✅ Total questions across all exercises: ${totalQuestions}`);

  // Step 5: Process the data
  console.log('\n5. Processing data...');

  const exercisesByChapter = new Map();
  exercises.forEach(exercise => {
    if (!exercisesByChapter.has(exercise.chapter_id)) {
      exercisesByChapter.set(exercise.chapter_id, []);
    }
    exercisesByChapter.get(exercise.chapter_id).push(exercise);
  });

  // Group by unique chapter title (deduplicate)
  const uniqueChapterMap = new Map();

  chapters.forEach(chapter => {
    const chapterTitle = chapter.title;

    if (!uniqueChapterMap.has(chapterTitle)) {
      uniqueChapterMap.set(chapterTitle, {
        title: chapterTitle,
        exercises: []
      });
    }

    const chapterExercises = exercisesByChapter.get(chapter.id) || [];
    uniqueChapterMap.get(chapterTitle).exercises.push(...chapterExercises);
  });

  console.log(`✅ Unique chapters: ${uniqueChapterMap.size}`);

  // Convert to final array
  const chaptersArray = Array.from(uniqueChapterMap.entries()).map(([chapterTitle, data]) => {
    // Deduplicate exercises
    const uniqueExercises = new Map();
    data.exercises.forEach(exercise => {
      const key = `${exercise.display_order}-${exercise.name}`;
      if (!uniqueExercises.has(key)) {
        uniqueExercises.set(key, exercise);
      }
    });

    const sortedExercises = Array.from(uniqueExercises.values())
      .sort((a, b) => a.display_order - b.display_order);

    const sections = sortedExercises.map(exercise => {
      const questionCount = questionCountsByExercise.get(exercise.id) || 0;
      return {
        id: exercise.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
        title: exercise.name,
        exerciseNumber: exercise.exercise_number,
        questionCount
      };
    });

    const totalQuestions = sections.reduce((sum, section) => sum + section.questionCount, 0);

    const chapterNumberMatch = chapterTitle.match(/Chapter\s+(\d+)/i);
    const chapterNumber = chapterNumberMatch ? parseInt(chapterNumberMatch[1]) : 9999;

    return {
      id: chapterTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
      title: chapterTitle,
      chapterNumber,
      sections,
      totalQuestions
    };
  })
  .sort((a, b) => a.chapterNumber - b.chapterNumber)
  .filter(chapter => chapter.totalQuestions > 0);

  console.log('\n' + '='.repeat(80));
  console.log('FINAL RESULT');
  console.log('='.repeat(80));
  console.log(`\nTotal chapters with questions: ${chaptersArray.length}\n`);

  chaptersArray.forEach((chapter, idx) => {
    console.log(`${idx + 1}. ${chapter.title}`);
    console.log(`   - ID: ${chapter.id}`);
    console.log(`   - Chapter Number: ${chapter.chapterNumber}`);
    console.log(`   - Total Questions: ${chapter.totalQuestions}`);
    console.log(`   - Exercises: ${chapter.sections.length}`);
    console.log('');
  });

  console.log('='.repeat(80));
  console.log(`SUCCESS: All ${chaptersArray.length} chapters retrieved!`);
  console.log('='.repeat(80));
}

testUpdatedAPI().catch(console.error);
