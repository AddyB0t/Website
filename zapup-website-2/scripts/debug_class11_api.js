#!/usr/bin/env node
/**
 * Debug script to test Class 11 Mathematics API query
 * This simulates what the API does to understand why only 5 chapters show
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testQuery() {
  console.log('='.repeat(80));
  console.log('TESTING CLASS 11 MATHEMATICS API QUERY');
  console.log('='.repeat(80));

  const classId = '11';
  const subjectId = 'mathematics';

  console.log('\n1. Testing questions table query (current API approach)');
  console.log('-'.repeat(80));

  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      chapter,
      id,
      exercise_id,
      class_id,
      subject,
      exercises!inner(name, exercise_number, display_order)
    `)
    .eq('class_id', classId)
    .ilike('subject', subjectId)
    .eq('is_active', true)
    .not('exercise_id', 'is', null);

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log(`✅ Found ${questions.length} questions`);

    // Get unique chapters
    const uniqueChapters = [...new Set(questions.map(q => q.chapter))];
    console.log(`📚 Unique chapters: ${uniqueChapters.length}`);
    uniqueChapters.sort().forEach((ch, idx) => {
      const count = questions.filter(q => q.chapter === ch).length;
      console.log(`   ${idx + 1}. ${ch} (${count} questions)`);
    });
  }

  console.log('\n2. Testing through books → chapters structure');
  console.log('-'.repeat(80));

  const { data: books, error: booksError } = await supabase
    .from('books')
    .select(`
      id,
      class_level,
      school_type,
      subjects!inner(id, name)
    `)
    .eq('class_level', '11')
    .ilike('subjects.name', 'mathematics');

  if (booksError) {
    console.error('❌ Books Error:', booksError);
  } else {
    console.log(`✅ Found ${books.length} books`);
    books.forEach(book => {
      console.log(`   - Book ID: ${book.id}, School Type: ${book.school_type}, Subject: ${book.subjects.name}`);
    });

    if (books.length > 0) {
      const bookIds = books.map(b => b.id);

      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('id, title, book_id')
        .in('book_id', bookIds);

      if (chaptersError) {
        console.error('❌ Chapters Error:', chaptersError);
      } else {
        console.log(`\n📚 Found ${chapters.length} chapters for these books`);
        chapters.sort((a, b) => {
          const aMatch = a.title.match(/Chapter\s+(\d+)/i);
          const bMatch = b.title.match(/Chapter\s+(\d+)/i);
          const aNum = aMatch ? parseInt(aMatch[1]) : 9999;
          const bNum = bMatch ? parseInt(bMatch[1]) : 9999;
          return aNum - bNum;
        }).forEach((ch, idx) => {
          console.log(`   ${idx + 1}. ${ch.title} (ID: ${ch.id})`);
        });

        // Get exercises for these chapters
        const chapterIds = chapters.map(c => c.id);
        const { data: exercises, error: exercisesError } = await supabase
          .from('exercises')
          .select('id, name, chapter_id')
          .in('chapter_id', chapterIds);

        if (exercisesError) {
          console.error('❌ Exercises Error:', exercisesError);
        } else {
          console.log(`\n📝 Found ${exercises.length} exercises for these chapters`);

          // Count questions per chapter
          const exerciseIds = exercises.map(e => e.id);
          const { data: allQuestions, error: questionsError } = await supabase
            .from('questions')
            .select('id, exercise_id, chapter, subject, class_id')
            .in('exercise_id', exerciseIds)
            .eq('is_active', true);

          if (questionsError) {
            console.error('❌ Questions Error:', questionsError);
          } else {
            console.log(`\n❓ Found ${allQuestions.length} questions linked to these exercises`);

            // Sample first question
            if (allQuestions.length > 0) {
              console.log('\n📄 Sample question:');
              console.log(`   class_id: "${allQuestions[0].class_id}"`);
              console.log(`   subject: "${allQuestions[0].subject}"`);
              console.log(`   chapter: "${allQuestions[0].chapter}"`);
              console.log(`   exercise_id: ${allQuestions[0].exercise_id}`);
            }
          }
        }
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('ANALYSIS');
  console.log('='.repeat(80));
  console.log('\nIf the first query shows fewer chapters than the second query,');
  console.log('it means the questions table has incorrect class_id or subject values.');
}

testQuery().catch(console.error);
