#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { randomUUID } = require('crypto');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// CSV directory
const CLASS_9_DIR = '/mnt/data/Pasia/Website/class 9th';

// Subject mapping: folder name -> subject name in database
const SUBJECT_MAPPING = {
  '9-Mathematics': 'Mathematics',
  '9-Physics': 'Physics',
  '9th-Chemistry': 'Chemistry',
  '9th-Computer': 'Computer',
  '9th-Geography': 'Geography',
  '9th-HistoryandCivi': 'History-Civics',
  '9th-English-Shakespear': 'English-Shakespeare',
  '9th-English(shortpoemandstories)': 'English-Poetry',
  '9th-BIOLAB': 'Biology-Lab',
  '9th-CHEMLAB': 'Chemistry-Lab',
  '9th-PhysicsLAB': 'Physics-Lab'
};

// CSV file mapping
const CSV_FILES = {
  '9-Mathematics': 'final_organized_questions_9th_maths.csv',
  '9th-Chemistry': 'organized_chemistry_questions.csv',
  '9th-Computer': 'organized_computer_questions.csv',
  '9th-Geography': 'organized_geography_questions.csv',
  '9th-HistoryandCivi': 'organized_history_civics_questions.csv',
  '9th-English-Shakespear': 'organized_shakespeare_final.csv',
  '9th-English(shortpoemandstories)': 'organized_english_final.csv',
  '9th-BIOLAB': 'organized_biology_lab_questions.csv',
  '9th-CHEMLAB': 'organized_chemistry_lab_questions.csv',
  '9th-PhysicsLAB': 'organized_physics_lab_questions.csv'
};

async function getOrCreateSubject(subjectName) {
  console.log(`  Looking up subject: ${subjectName}`);

  const { data: existing, error: selectError } = await supabase
    .from('subjects')
    .select('id, name')
    .ilike('name', subjectName)
    .single();

  if (existing) {
    console.log(`  ✓ Found existing subject: ${existing.name} (${existing.id})`);
    return existing;
  }

  // Create new subject
  const { data: newSubject, error: insertError } = await supabase
    .from('subjects')
    .insert([{ name: subjectName }])
    .select()
    .single();

  if (insertError) {
    console.error(`  ✗ Error creating subject:`, insertError);
    throw insertError;
  }

  console.log(`  ✓ Created new subject: ${newSubject.name} (${newSubject.id})`);
  return newSubject;
}

async function processCSV(folderName, csvFileName, subjectName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📚 Processing: ${subjectName}`);
  console.log(`${'='.repeat(80)}`);

  const csvPath = path.join(CLASS_9_DIR, folderName, csvFileName);

  if (!fs.existsSync(csvPath)) {
    console.log(`⚠️  CSV file not found: ${csvPath}`);
    return;
  }

  // Read and parse CSV
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`📄 Loaded ${records.length} questions from CSV`);

  if (records.length === 0) {
    console.log('⚠️  No records found in CSV');
    return;
  }

  // Get or create subject
  const subject = await getOrCreateSubject(subjectName);

  // Create book
  console.log(`\n📖 Creating book...`);
  const { data: book, error: bookError} = await supabase
    .from('books')
    .insert([{
      id: randomUUID(),
      title: `Class 9 ${subjectName}`,
      class_level: '9',
      subject_id: subject.id,
      school_type: 'ICSE (Indian Certificate of Secondary Education)'
    }])
    .select()
    .single();

  if (bookError) {
    console.error('✗ Error creating book:', bookError);
    throw bookError;
  }

  console.log(`✓ Created book (${book.id})`);

  // Group questions by chapter and exercise
  const structure = {};

  records.forEach((row, idx) => {
    const chapterName = row.chapter_name || row.chapter_id || `Chapter ${row.chapter_number || 1}`;
    const exerciseName = row.exercise_name || 'Questions';
    const exerciseNumber = parseInt(row.exercise_number || row.question_number || 1);

    if (!structure[chapterName]) {
      structure[chapterName] = {};
    }

    if (!structure[chapterName][exerciseName]) {
      structure[chapterName][exerciseName] = {
        number: exerciseNumber,
        questions: []
      };
    }

    structure[chapterName][exerciseName].questions.push({
      text: row.question_text,
      type: row.question_type || 'general',
      order_index: structure[chapterName][exerciseName].questions.length
    });
  });

  console.log(`\n📊 Structure: ${Object.keys(structure).length} chapters`);

  // Upload structure
  let chapterCount = 0;
  let exerciseCount = 0;
  let questionCount = 0;

  let chapterIndex = 0;
  for (const [chapterName, exercises] of Object.entries(structure)) {
    console.log(`\n  📑 Chapter: ${chapterName}`);
    chapterIndex++;

    // Create chapter
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .insert([{
        id: randomUUID(),
        book_id: book.id,
        title: chapterName,
        chapter_number: chapterIndex
      }])
      .select()
      .single();

    if (chapterError) {
      console.error('    ✗ Error creating chapter:', chapterError);
      continue;
    }

    chapterCount++;

    // Create exercises
    const exerciseList = Object.entries(exercises);
    for (let i = 0; i < exerciseList.length; i++) {
      const [exerciseName, exerciseData] = exerciseList[i];

      const { data: exercise, error: exerciseError } = await supabase
        .from('exercises')
        .insert([{
          chapter_id: chapter.id,
          name: exerciseName,
          exercise_number: exerciseData.number || (i + 1),
          display_order: i
        }])
        .select()
        .single();

      if (exerciseError) {
        console.error(`      ✗ Error creating exercise "${exerciseName}":`, exerciseError);
        continue;
      }

      exerciseCount++;

      // Insert questions in batches
      const batchSize = 100;
      const questions = exerciseData.questions.map(q => ({
        text: q.text,
        exercise_id: exercise.id,
        class_id: '9',
        subject: subjectName,
        chapter: chapterName,
        is_active: true,
        order_index: q.order_index
      }));

      for (let j = 0; j < questions.length; j += batchSize) {
        const batch = questions.slice(j, j + batchSize);
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(batch);

        if (questionsError) {
          console.error(`      ✗ Error inserting questions:`, questionsError);
        } else {
          questionCount += batch.length;
        }
      }

      console.log(`    ✓ Exercise: ${exerciseName} (${exerciseData.questions.length} questions)`);
    }
  }

  console.log(`\n✅ Summary:`);
  console.log(`   Chapters: ${chapterCount}`);
  console.log(`   Exercises: ${exerciseCount}`);
  console.log(`   Questions: ${questionCount}`);
}

async function main() {
  console.log('\n🚀 Starting Class 9 Data Re-upload\n');

  let successCount = 0;
  let failCount = 0;

  for (const [folderName, subjectName] of Object.entries(SUBJECT_MAPPING)) {
    const csvFileName = CSV_FILES[folderName];

    if (!csvFileName) {
      console.log(`⚠️  No CSV file mapping for ${folderName}`);
      continue;
    }

    try {
      await processCSV(folderName, csvFileName, subjectName);
      successCount++;
    } catch (error) {
      console.error(`\n❌ Failed to process ${subjectName}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ Completed!`);
  console.log(`   Success: ${successCount} subjects`);
  console.log(`   Failed: ${failCount} subjects`);
  console.log(`${'='.repeat(80)}\n`);
}

main().catch(console.error);
