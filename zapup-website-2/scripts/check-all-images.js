// Check all images and their question links
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllImages() {
  console.log('🔍 Checking all uploaded images...\n');

  const { data: images, error } = await supabase
    .from('uploaded_question_images')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`📊 Last ${images.length} uploaded images:\n`);

  images.forEach((img, idx) => {
    console.log(`${idx + 1}. ${img.file_name}`);
    console.log(`   Image ID: ${img.id}`);
    console.log(`   User ID: ${img.user_id}`);
    console.log(`   Question ID: ${img.question_id || 'NOT LINKED'}`);
    console.log(`   Is Community: ${img.is_community || false}`);
    console.log(`   Linked At: ${img.linked_at || 'N/A'}`);
    console.log(`   Uploaded At: ${img.uploaded_at}`);
    console.log('');
  });

  const linkedImages = images.filter(img => img.question_id !== null);
  console.log(`\n📌 Summary:`);
  console.log(`   Total images: ${images.length}`);
  console.log(`   Linked to questions: ${linkedImages.length}`);
  console.log(`   Not linked: ${images.length - linkedImages.length}`);

  if (linkedImages.length > 0) {
    console.log(`\n✅ Question IDs with images:`);
    linkedImages.forEach(img => {
      console.log(`   Question #${img.question_id} -> ${img.file_name}`);
    });
  }
}

checkAllImages().catch(console.error);
