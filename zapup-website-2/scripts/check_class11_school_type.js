#!/usr/bin/env node
/**
 * Check the actual school_type for Class 11 books
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchoolType() {
  console.log('Checking school_type values for Class 11 books...\n');

  const { data: books, error } = await supabase
    .from('books')
    .select('id, class_level, school_type, subjects!inner(name)')
    .eq('class_level', '11');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${books.length} books for Class 11:\n`);

  const schoolTypes = new Set();
  books.forEach(book => {
    schoolTypes.add(book.school_type);
    console.log(`Subject: ${book.subjects.name}`);
    console.log(`School Type: "${book.school_type}"`);
    console.log('---');
  });

  console.log(`\nUnique school_type values:`);
  schoolTypes.forEach(type => console.log(`  - "${type}"`));
}

checkSchoolType().catch(console.error);
