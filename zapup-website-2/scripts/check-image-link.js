// Check if the image is properly linked in the database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImageLink() {
  console.log('🔍 Checking image link for question #35966...\n');

  // Check if the columns exist
  const { data: columns, error: schemaError } = await supabase
    .from('uploaded_question_images')
    .select('*')
    .limit(1);

  if (schemaError) {
    console.error('❌ Error accessing table:', schemaError.message);
    console.log('\n⚠️  The database migration may not have been run yet.');
    console.log('📋 Please run: migrations/add-question-image-linking.sql');
    return;
  }

  if (columns && columns.length > 0) {
    const columnNames = Object.keys(columns[0]);
    console.log('✅ Table columns:', columnNames.join(', '));

    const hasQuestionId = columnNames.includes('question_id');
    const hasIsCommunity = columnNames.includes('is_community');
    const hasLinkedAt = columnNames.includes('linked_at');

    console.log('\n📊 Migration Status:');
    console.log(`   question_id column: ${hasQuestionId ? '✅' : '❌'}`);
    console.log(`   is_community column: ${hasIsCommunity ? '✅' : '❌'}`);
    console.log(`   linked_at column: ${hasLinkedAt ? '✅' : '❌'}`);

    if (!hasQuestionId || !hasIsCommunity || !hasLinkedAt) {
      console.log('\n⚠️  MIGRATION NOT COMPLETE!');
      console.log('📋 Please run: migrations/add-question-image-linking.sql');
      return;
    }
  }

  // Check for the specific image
  const { data: images, error } = await supabase
    .from('uploaded_question_images')
    .select('*')
    .eq('question_id', 35966);

  if (error) {
    console.error('\n❌ Error fetching images:', error.message);
    return;
  }

  console.log(`\n🖼️  Found ${images.length} image(s) linked to question #35966:\n`);

  images.forEach((img, idx) => {
    console.log(`Image ${idx + 1}:`);
    console.log(`   ID: ${img.id}`);
    console.log(`   User ID: ${img.user_id}`);
    console.log(`   Question ID: ${img.question_id}`);
    console.log(`   Is Community: ${img.is_community}`);
    console.log(`   Linked At: ${img.linked_at}`);
    console.log(`   File Name: ${img.file_name}`);
    console.log(`   Image URL: ${img.image_url?.substring(0, 50)}...`);
    console.log('');
  });

  if (images.length === 0) {
    console.log('⚠️  No images found. The upload may have failed or the question_id was not set.');
  } else {
    console.log('✅ Image link is working correctly in the database!');
    console.log('\n💡 If the image is not showing on the page:');
    console.log('   1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)');
    console.log('   2. Check browser console for errors');
    console.log('   3. Verify the user is logged in');
  }
}

checkImageLink().catch(console.error);
