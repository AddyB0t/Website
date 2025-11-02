// Fix the image link to match the question shown in the UI
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkQuestion() {
  console.log('🔍 Checking question data...\n');

  // Get the question that should be #35966 or #36966
  const { data: q1, error: e1 } = await supabase
    .from('questions')
    .select('*')
    .eq('id', 35966)
    .single();

  const { data: q2, error: e2 } = await supabase
    .from('questions')
    .select('*')
    .eq('id', 36966)
    .single();

  console.log('Question #35966:', q1 ? `"${q1.text?.substring(0, 80)}..."` : 'NOT FOUND');
  console.log('Question #36966:', q2 ? `"${q2.text?.substring(0, 80)}..."` : 'NOT FOUND');

  console.log('\n📷 Current image link:');
  const { data: img } = await supabase
    .from('uploaded_question_images')
    .select('*')
    .eq('question_id', 36966)
    .single();

  if (img) {
    console.log(`   Image "${img.file_name}" is linked to question #${img.question_id}`);
    console.log(`   Uploaded by: ${img.user_id}`);
  } else {
    console.log('   No image found linked to #36966');
  }

  // Check if there's a question with the text from your screenshot
  const { data: circleQuestions } = await supabase
    .from('questions')
    .select('*')
    .or('text.ilike.%arcs and angles%,text.ilike.%ZBOC%,text.ilike.%ZXB%')
    .limit(5);

  if (circleQuestions && circleQuestions.length > 0) {
    console.log('\n🎯 Found circle/arcs questions:');
    circleQuestions.forEach(q => {
      console.log(`   Question #${q.id}: "${q.text?.substring(0, 80)}..."`);
    });
  }
}

checkQuestion().catch(console.error);
