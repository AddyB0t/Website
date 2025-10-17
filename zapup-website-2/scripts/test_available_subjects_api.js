#!/usr/bin/env node
/**
 * Test what the available-subjects API returns for Class 11
 */

async function testAPI() {
  const response = await fetch('http://localhost:3001/api/questions/available-subjects?class=11&board=ISC');
  const data = await response.json();

  console.log('API Response:');
  console.log(JSON.stringify(data, null, 2));

  console.log('\nSubject IDs returned:');
  data.availableSubjects?.forEach(s => {
    console.log(`  - "${s.subject}" (${s.totalQuestions} questions, ${s.totalChapters} chapters)`);
  });
}

testAPI().catch(console.error);
