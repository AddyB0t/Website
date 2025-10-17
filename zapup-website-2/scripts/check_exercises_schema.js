#!/usr/bin/env node
/**
 * Check the actual schema of the exercises table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log('Fetching one exercise to see all columns...');

  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('\nExercise table columns:');
    console.log('='.repeat(80));
    Object.keys(data[0]).forEach(key => {
      console.log(`  ${key}: ${typeof data[0][key]} = ${data[0][key]}`);
    });
  }
}

checkSchema().catch(console.error);
