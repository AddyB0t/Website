const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key for admin operations (bypasses RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.log('Make sure you have either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Base directory for Class 7th Mathematics questions
const baseDir = '/mnt/data/Pasia/Website/Questions/Class 7th/Mathematics';

// Question chapters from your folder structure
const questionChapters = [
  'A Peek Beyond The Point',
  'A Tale Of Three Intersecting Lines',
  'Arithmetic Expressions',
  'Expressions Using Letter-Numbers',
  'Large Number Around Us',
  'Number Play',
  'Parallel And Intersecting Lines',
  'Working With Fractions'
];

// Simple function to parse questions from markdown
function parseQuestionsFromFile(content, chapterName) {
  const lines = content.split('\n');
  const questions = [];
  let currentSection = 'General';
  let questionOrder = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Section headers (## Something)
    if (line.match(/^##\s+/)) {
      currentSection = line.replace(/^##\s+/, '').trim();
    }
    
    // Numbered questions (1. Something)
    else if (line.match(/^\d+\.\s+/)) {
      const questionText = line.replace(/^\d+\.\s+/, '').trim();
      if (questionText) {
        questions.push({
          text: questionText,
          chapter: chapterName,
          section: currentSection,
          order_index: questionOrder++,
          difficulty: 'medium' // Default difficulty
        });
      }
    }
  }
  
  return questions;
}

// Main loading function
async function loadQuestions() {
  try {
    console.log('🚀 Loading Class 7 Mathematics questions...');
    console.log(`📁 Source: ${baseDir}`);
    
    // Check if directory exists
    if (!fs.existsSync(baseDir)) {
      console.error(`❌ Directory not found: ${baseDir}`);
      return;
    }
    
    console.log('📚 Setting up basic database structure...');
    
    // Ensure mathematics subject exists (should already exist from schema)
    const { data: subject, error: subjectError } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', 'mathematics')
      .single();
    
    if (subjectError) {
      console.log('Creating mathematics subject...');
      const { error: insertError } = await supabase
        .from('subjects')
        .insert({
          id: 'mathematics',
          name: 'Mathematics',
          description: 'Learn essential mathematical concepts with step-by-step explanations'
        });
      
      if (insertError) {
        console.error('Error creating subject:', insertError);
        return;
      }
    }
    console.log('✅ Mathematics subject ready');
    
    // Ensure Class 7 exists (should already exist from schema)
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', '7')
      .single();
    
    if (classError) {
      console.log('Creating Class 7...');
      const { error: insertError } = await supabase
        .from('classes')
        .insert({
          id: '7',
          name: 'Class 7',
          subject_id: 'mathematics'
        });
      
      if (insertError) {
        console.error('Error creating class:', insertError);
        return;
      }
    }
    console.log('✅ Class 7 ready');
    
    let totalQuestionsLoaded = 0;
    
    // Process each chapter folder
    for (const chapterName of questionChapters) {
      const chapterDir = path.join(baseDir, chapterName);
      const questionFile = path.join(chapterDir, 'questions.md');
      
      console.log(`\n📖 Processing: ${chapterName}`);
      
      if (!fs.existsSync(questionFile)) {
        console.log(`   ⚠️  File not found: questions.md`);
        continue;
      }
      
      // Read and parse the file
      const content = fs.readFileSync(questionFile, 'utf8');
      const questions = parseQuestionsFromFile(content, chapterName);
      
      console.log(`   📝 Found ${questions.length} questions`);
      
      if (questions.length > 0) {
        // Insert questions in batches
        const batchSize = 50;
        for (let i = 0; i < questions.length; i += batchSize) {
          const batch = questions.slice(i, i + batchSize).map(q => ({
            ...q,
            class_id: '7' // Class 7
          }));
          
          const { error } = await supabase
            .from('questions')
            .insert(batch);
          
          if (error) {
            console.error(`   ❌ Error inserting batch: ${error.message}`);
          } else {
            console.log(`   ✅ Inserted ${batch.length} questions`);
            totalQuestionsLoaded += batch.length;
          }
        }
      }
    }
    
    console.log(`\n🎉 Loading complete!`);
    console.log(`📊 Total questions loaded: ${totalQuestionsLoaded}`);
    
    // Show summary
    const { data: summary } = await supabase
      .from('questions')
      .select('chapter, count(*)')
      .eq('class_id', '7');
    
    if (summary) {
      console.log('\n📋 Summary by chapter:');
      summary.forEach(item => {
        console.log(`   ${item.chapter}: ${item.count} questions`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
if (require.main === module) {
  loadQuestions();
} 