const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function uploadPhysics() {
  console.log('🚀 Starting Physics upload for Class 9...\n');

  const csvPath = '/mnt/data/Pasia/Website/class 9th/9-Physics/organized_physics_questions.csv';

  if (!fs.existsSync(csvPath)) {
    console.error('❌ Physics CSV file not found!');
    return;
  }

  // Read and parse CSV
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`📊 Found ${records.length} questions in CSV\n`);

  // Get or create Physics subject
  let { data: subject, error: subjectError } = await supabase
    .from('subjects')
    .select('*')
    .eq('name', 'Physics')
    .single();

  if (subjectError || !subject) {
    console.log('Creating Physics subject...');
    const { data: newSubject, error: createError } = await supabase
      .from('subjects')
      .insert([{ name: 'Physics' }])
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating subject:', createError);
      return;
    }
    subject = newSubject;
  }

  console.log(`✓ Subject: Physics (ID: ${subject.id})\n`);

  // Create book
  const { data: book, error: bookError } = await supabase
    .from('books')
    .insert([{
      id: randomUUID(),
      title: 'Class 9 Physics',
      class_level: '9',
      subject_id: subject.id,
      school_type: 'ICSE (Indian Certificate of Secondary Education)'
    }])
    .select()
    .single();

  if (bookError) {
    console.error('❌ Error creating book:', bookError);
    return;
  }

  console.log(`✓ Book created: ${book.title}\n`);

  // Organize data by chapter and exercise
  const chapters = {};

  for (const record of records) {
    const chapterName = record.chapter_name;
    const exerciseName = record.exercise_name;

    if (!chapters[chapterName]) {
      chapters[chapterName] = {
        number: parseInt(record.chapter_number),
        exercises: {}
      };
    }

    if (!chapters[chapterName].exercises[exerciseName]) {
      chapters[chapterName].exercises[exerciseName] = [];
    }

    chapters[chapterName].exercises[exerciseName].push({
      text: record.question_text,
      number: parseFloat(record.question_number),
      type: record.question_type,
      difficulty: record.difficulty_level
    });
  }

  console.log(`📚 Processing ${Object.keys(chapters).length} chapters...\n`);

  let totalQuestionsUploaded = 0;
  let totalExercises = 0;
  let chapterIndex = 0;

  // Process each chapter
  for (const [chapterName, chapterData] of Object.entries(chapters)) {
    console.log(`\n📖 Chapter ${++chapterIndex}: ${chapterName}`);

    // Create chapter
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .insert([{
        id: randomUUID(),
        book_id: book.id,
        title: chapterName,
        chapter_number: chapterData.number
      }])
      .select()
      .single();

    if (chapterError) {
      console.error(`   ❌ Error creating chapter: ${chapterError.message}`);
      continue;
    }

    // Process each exercise
    const exerciseNames = Object.keys(chapterData.exercises);
    console.log(`   ${exerciseNames.length} exercises`);

    for (let i = 0; i < exerciseNames.length; i++) {
      const exerciseName = exerciseNames[i];
      const questions = chapterData.exercises[exerciseName];

      // Create exercise
      const { data: exercise, error: exerciseError } = await supabase
        .from('exercises')
        .insert([{
          chapter_id: chapter.id,
          name: exerciseName,
          exercise_number: i + 1,
          display_order: i
        }])
        .select()
        .single();

      if (exerciseError) {
        console.error(`      ❌ Error creating exercise: ${exerciseError.message}`);
        continue;
      }

      totalExercises++;

      // Prepare questions for batch insert
      const questionsToInsert = questions
        .filter(q => q.text && q.text.trim()) // Filter out null/empty questions
        .map((q, idx) => ({
          text: q.text,
          exercise_id: exercise.id,
          class_id: '9',
          subject: 'Physics',
          chapter: chapterName,
          is_active: true,
          order_index: idx
        }));

      // Insert questions in batches of 100
      const batchSize = 100;
      for (let j = 0; j < questionsToInsert.length; j += batchSize) {
        const batch = questionsToInsert.slice(j, j + batchSize);
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(batch);

        if (questionsError) {
          console.error(`      ❌ Error inserting questions batch: ${questionsError.message}`);
        } else {
          totalQuestionsUploaded += batch.length;
        }
      }

      const skipped = questions.length - questionsToInsert.length;
      console.log(`      ✓ ${exerciseName}: ${questionsToInsert.length} questions${skipped > 0 ? ` (${skipped} skipped - null text)` : ''}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ PHYSICS UPLOAD COMPLETE!');
  console.log('='.repeat(60));
  console.log(`📊 Total Chapters: ${Object.keys(chapters).length}`);
  console.log(`📝 Total Exercises: ${totalExercises}`);
  console.log(`❓ Total Questions: ${totalQuestionsUploaded}`);
  console.log('='.repeat(60));
}

uploadPhysics().catch(console.error);
