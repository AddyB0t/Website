// Find which question has the uploaded image
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findQuestionWithImage() {
  console.log('🔍 Finding question with uploaded image...\n');

  // Get the uploaded image
  const { data: image } = await supabase
    .from('uploaded_question_images')
    .select('*')
    .not('question_id', 'is', null)
    .order('linked_at', { ascending: false })
    .limit(1);

  if (!image || image.length === 0) {
    console.log('❌ No images linked to questions found');
    return;
  }

  const img = image[0];
  console.log('📷 Most Recent Linked Image:');
  console.log(`   File: ${img.file_name}`);
  console.log(`   Linked to Question: #${img.question_id}`);
  console.log(`   User: ${img.user_id}`);
  console.log(`   Community: ${img.is_community}`);

  // Get the question details
  const { data: question } = await supabase
    .from('questions')
    .select('*')
    .eq('id', img.question_id)
    .single();

  if (!question) {
    console.log('\n❌ Question not found in database!');
    return;
  }

  console.log('\n📝 Question Details:');
  console.log(`   ID: ${question.id}`);
  console.log(`   Number: ${question.question_number || 'N/A'}`);
  console.log(`   Class: ${question.class_id}`);
  console.log(`   Subject: ${question.subject}`);
  console.log(`   Chapter: ${question.chapter}`);
  console.log(`   Text: ${question.text}`);

  console.log('\n🎯 How to Find This Question:');
  console.log(`   1. Go to: http://localhost:3000/questions/${question.class_id}/${question.subject?.toLowerCase()?.replace(/ /g, '-')}?board=CBSE`);
  console.log(`   2. Look for chapter: "${question.chapter}"`);
  console.log(`   3. Find the question with text starting with: "${question.text?.substring(0, 50)}..."`);
  console.log(`   4. The image should appear in the "Question Image" section`);
}

findQuestionWithImage().catch(console.error);
