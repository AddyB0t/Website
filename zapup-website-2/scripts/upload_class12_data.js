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

// Subject mapping: folder name => subject name in database
const SUBJECT_MAPPING = {
  '12th-Accountancy': {
    name: 'Accountancy',
    csvFile: 'organized_12th_accountancy_questions.csv'
  },
  '12th-BussinessStudies': {
    name: 'Business-Studies',
    csvFile: 'organized_12th_business_studies_questions.csv'
  },
  '12th-Chemistry': {
    name: 'Chemistry',
    csvFile: 'organized_12th_chemistry_questions.csv'
  },
  '12th-Commerce': {
    name: 'Commerce',
    csvFile: 'reorganized_commerce_questions.csv'
  },
  '12th-ComputerScience': {
    name: 'Computer-Science',
    csvFile: 'reorganized_computer_science_questions.csv'
  },
  '12th-Economics': {
    name: 'Economics',
    csvFile: 'reorganized_economics_questions.csv'
  },
  '12th-EVS': {
    name: 'Environmental-Studies',
    csvFile: 'reorganized_12th_evs_questions.csv'
  },
  '12th-Physics-merged': {
    name: 'Physics',
    csvFile: 'physics_12th_merged_organized.csv'
  }
};

async function uploadClass12Data() {
  console.log('🚀 Starting Class 12 data upload...\n');
  console.log('=' .repeat(70));

  const basePath = '/mnt/data/Pasia/Website/12th';
  const stats = {
    totalSubjects: 0,
    totalChapters: 0,
    totalExercises: 0,
    totalQuestions: 0,
    failedQuestions: 0
  };

  for (const [folder, subjectInfo] of Object.entries(SUBJECT_MAPPING)) {
    const csvPath = path.join(basePath, folder, subjectInfo.csvFile);

    if (!fs.existsSync(csvPath)) {
      console.log(`⚠️  Skipping ${subjectInfo.name} - CSV not found: ${csvPath}\n`);
      continue;
    }

    console.log(`\n📚 Processing ${subjectInfo.name}...`);
    console.log('-'.repeat(70));

    try {
      // Read and parse CSV
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      console.log(`   📊 Found ${records.length} questions in CSV`);

      // Get or create subject
      let { data: subject, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('name', subjectInfo.name)
        .single();

      if (subjectError || !subject) {
        const subjectCode = subjectInfo.name.toUpperCase().replace(/-/g, '_');
        const { data: newSubject, error: createError } = await supabase
          .from('subjects')
          .insert([{
            name: subjectInfo.name,
            code: subjectCode,
            category: 'Core',
            class_levels: [12],
            is_active: true
          }])
          .select()
          .single();

        if (createError) {
          console.error(`   ❌ Error creating subject:`, createError.message);
          continue;
        }
        subject = newSubject;
      }

      // Create book
      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert([{
          id: randomUUID(),
          title: `Class 12 ${subjectInfo.name}`,
          class_level: '12',
          subject_id: subject.id,
          school_type: 'ICSE (Indian Certificate of Secondary Education)'
        }])
        .select()
        .single();

      if (bookError) {
        console.error(`   ❌ Error creating book:`, bookError.message);
        continue;
      }

      // Organize data by chapter and exercise
      const chapters = {};

      for (const record of records) {
        const chapterName = record.chapter_name;
        const exerciseName = record.exercise_name;

        if (!chapterName || !exerciseName) continue;

        if (!chapters[chapterName]) {
          chapters[chapterName] = {
            number: parseInt(record.chapter_number) || 1,
            exercises: {}
          };
        }

        if (!chapters[chapterName].exercises[exerciseName]) {
          chapters[chapterName].exercises[exerciseName] = [];
        }

        chapters[chapterName].exercises[exerciseName].push({
          text: record.question_text,
          number: parseFloat(record.question_number) || 0,
          type: record.question_type,
          difficulty: record.difficulty_level
        });
      }

      console.log(`   📖 ${Object.keys(chapters).length} chapters to process`);

      let subjectQuestions = 0;
      let subjectExercises = 0;
      let subjectFailedQuestions = 0;

      // Process each chapter
      for (const [chapterName, chapterData] of Object.entries(chapters)) {
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
          console.error(`      ❌ Error creating chapter ${chapterName}:`, chapterError.message);
          continue;
        }

        // Process each exercise
        const exerciseNames = Object.keys(chapterData.exercises);

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
            console.error(`         ❌ Error creating exercise:`, exerciseError.message);
            continue;
          }

          subjectExercises++;

          // Prepare questions for batch insert
          const questionsToInsert = questions
            .filter(q => q.text && q.text.trim())
            .map((q, idx) => ({
              text: q.text,
              exercise_id: exercise.id,
              class_id: '12',
              subject: subjectInfo.name,
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
              console.error(`         ❌ Batch error:`, questionsError.message);
              subjectFailedQuestions += batch.length;
            } else {
              subjectQuestions += batch.length;
            }
          }

          const skipped = questions.length - questionsToInsert.length;
          if (skipped > 0) {
            subjectFailedQuestions += skipped;
          }
        }
      }

      stats.totalSubjects++;
      stats.totalChapters += Object.keys(chapters).length;
      stats.totalExercises += subjectExercises;
      stats.totalQuestions += subjectQuestions;
      stats.failedQuestions += subjectFailedQuestions;

      console.log(`   ✅ ${subjectInfo.name}: ${subjectQuestions} questions, ${subjectExercises} exercises, ${Object.keys(chapters).length} chapters`);
      if (subjectFailedQuestions > 0) {
        console.log(`   ⚠️  ${subjectFailedQuestions} questions failed/skipped`);
      }

    } catch (error) {
      console.error(`   ❌ Error processing ${subjectInfo.name}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ CLASS 12 UPLOAD COMPLETE!');
  console.log('='.repeat(70));
  console.log(`📚 Total Subjects: ${stats.totalSubjects}`);
  console.log(`📖 Total Chapters: ${stats.totalChapters}`);
  console.log(`📝 Total Exercises: ${stats.totalExercises}`);
  console.log(`❓ Total Questions: ${stats.totalQuestions}`);
  if (stats.failedQuestions > 0) {
    console.log(`⚠️  Failed/Skipped Questions: ${stats.failedQuestions}`);
  }
  console.log('='.repeat(70));
}

uploadClass12Data().catch(console.error);
