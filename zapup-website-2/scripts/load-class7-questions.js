const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration from environment variables
require('dotenv').config();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Base directory for Class 7th Mathematics questions
const baseDir = 'D:\\Addy\\Client\\Questions\\Class 7th\\Mathematics';

// Question chapters mapping
const questionChapters = [
  'A Peek Beyond The Point',
  'Parallel And Intersecting Lines', 
  'Number Play',
  'A Tale Of Three Intersecting Lines',
  'Working With Fractions',
  'Expressions Using Letter-Numbers',
  'Arithmetic Expressions',
  'Large Number Around Us'
];

// Function to parse markdown question file
function parseQuestionFile(content, chapterTitle) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let currentQuestions = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for main chapter header (# Chapter X: Title)
    if (line.match(/^#\s+Chapter\s+\d+:/)) {
      continue; // Skip main chapter header
    }
    
    // Check for section headers (## X.X or ## Title)
    if (line.match(/^##\s+/)) {
      // Save previous section
      if (currentSection && currentQuestions.length > 0) {
        sections.push({
          title: currentSection,
          questions: [...currentQuestions]
        });
      }
      
      // Start new section
      currentSection = line.replace(/^##\s+/, '').trim();
      currentQuestions = [];
    }
    
    // Check for subsection headers (### Something)
    else if (line.match(/^###\s+/)) {
      // This is a subsection, we can use it as part of the section title
      const subsection = line.replace(/^###\s+/, '').trim();
      if (currentSection && !currentSection.includes(subsection)) {
        currentSection = `${currentSection} - ${subsection}`;
      }
    }
    
    // Check for numbered questions
    else if (line.match(/^\d+\.\s+/)) {
      const questionText = line.replace(/^\d+\.\s+/, '').trim();
      if (questionText) {
        currentQuestions.push(questionText);
      }
    }
    
    // Check for lettered sub-questions or continuation
    else if (line.match(/^\s*-\s+\([a-z]\)/)) {
      const subQuestion = line.trim();
      if (currentQuestions.length > 0 && subQuestion) {
        // Append to the last question
        currentQuestions[currentQuestions.length - 1] += '\n' + subQuestion;
      }
    }
    
    // Check for bullet points that might be part of a question
    else if (line.match(/^\s*-\s+/) && currentQuestions.length > 0) {
      const bulletPoint = line.trim();
      if (bulletPoint && !bulletPoint.match(/^-\s*$/)) {
        // Append to the last question
        currentQuestions[currentQuestions.length - 1] += '\n' + bulletPoint;
      }
    }
  }
  
  // Save the last section
  if (currentSection && currentQuestions.length > 0) {
    sections.push({
      title: currentSection,
      questions: [...currentQuestions]
    });
  }
  
  return sections;
}

// Function to clean and format question text
function cleanQuestionText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
    .replace(/`(.*?)`/g, '$1')       // Remove code markdown
    .replace(/^\s+|\s+$/g, '')       // Trim whitespace
    .replace(/\s+/g, ' ')            // Normalize spaces
    .substring(0, 2000);             // Limit length for database
}

// Main function to load questions
async function loadQuestions() {
  try {
    console.log('🚀 Starting to load Class 7th Mathematics questions into database...');
    
    // First, ensure we have the basic structure
    console.log('📚 Setting up basic database structure...');
    
    // Ensure mathematics subject exists
    const { data: subject, error: subjectError } = await supabase
      .from('subjects')
      .upsert({
        id: 'mathematics',
        name: 'Mathematics',
        description: 'Learn essential mathematical concepts with step-by-step explanations'
      }, { onConflict: 'id' })
      .select()
      .single();
    
    if (subjectError) {
      console.error('Error creating subject:', subjectError);
      return;
    }
    console.log('✅ Mathematics subject ready');
    
    // Ensure NCERT Math book exists
    const { data: book, error: bookError } = await supabase
      .from('books')
      .upsert({
        id: 'ncert-math-7',
        title: 'NCERT Mathematics Class 7',
        subject_id: 'mathematics',
        publisher: 'NCERT',
        year: 2023
      }, { onConflict: 'id' })
      .select()
      .single();
    
    if (bookError) {
      console.error('Error creating book:', bookError);
      return;
    }
    console.log('✅ NCERT Math Class 7 book ready');
    
    // Ensure Class 7 exists
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .upsert({
        id: '7',
        name: 'Class 7',
        book_id: 'ncert-math-7'
      }, { onConflict: 'id' })
      .select()
      .single();
    
    if (classError) {
      console.error('Error creating class:', classError);
      return;
    }
    console.log('✅ Class 7 ready');
    
    // Process each question chapter
    for (let chapterIndex = 0; chapterIndex < questionChapters.length; chapterIndex++) {
      const chapterTitle = questionChapters[chapterIndex];
      const chapterDir = path.join(baseDir, chapterTitle);
      const questionFile = path.join(chapterDir, 'questions.md');
      
      console.log(`\n📖 Processing: ${chapterTitle}`);
      
      // Check if file exists
      if (!fs.existsSync(questionFile)) {
        console.log(`⚠️  File not found: ${questionFile}`);
        continue;
      }
      
      // Read and parse the file
      const content = fs.readFileSync(questionFile, 'utf8');
      const sections = parseQuestionFile(content, chapterTitle);
      
      console.log(`   Found ${sections.length} sections`);
      
      // Create chapter
      const { data: chapter, error: chapterError } = await supabase
        .from('chapters')
        .upsert({
          title: chapterTitle,
          class_id: '7',
          order_index: chapterIndex + 1
        }, { 
          onConflict: 'title,class_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();
      
      if (chapterError) {
        console.error(`   Error creating chapter: ${chapterError.message}`);
        continue;
      }
      
      console.log(`   ✅ Chapter created: ${chapter.title} (ID: ${chapter.id})`);
      
      // Process each section as an exercise
      for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        const section = sections[sectionIndex];
        const exerciseId = `ch${chapter.id}-ex${sectionIndex + 1}`;
        
        console.log(`      📝 Processing section: ${section.title} (${section.questions.length} questions)`);
        
        // Create exercise
        const { data: exercise, error: exerciseError } = await supabase
          .from('exercises')
          .upsert({
            id: exerciseId,
            title: section.title,
            chapter_id: chapter.id,
            order_index: sectionIndex + 1
          }, { onConflict: 'id' })
          .select()
          .single();
        
        if (exerciseError) {
          console.error(`      Error creating exercise: ${exerciseError.message}`);
          continue;
        }
        
        // Insert questions in batches
        const batchSize = 10;
        for (let i = 0; i < section.questions.length; i += batchSize) {
          const batch = section.questions.slice(i, i + batchSize);
          const questionData = batch.map((questionText, index) => ({
            text: cleanQuestionText(questionText),
            exercise_id: exerciseId,
            order_index: i + index + 1,
            difficulty: 'medium'
          }));
          
          const { error: questionsError } = await supabase
            .from('questions')
            .insert(questionData);
          
          if (questionsError) {
            console.error(`      Error inserting questions batch: ${questionsError.message}`);
          } else {
            console.log(`      ✅ Inserted ${batch.length} questions (batch ${Math.floor(i/batchSize) + 1})`);
          }
        }
        
        console.log(`      ✅ Section completed: ${section.questions.length} questions`);
      }
      
      console.log(`✅ Chapter completed: ${chapterTitle}`);
    }
    
    console.log('\n🎉 All Class 7th Mathematics questions loaded successfully!');
    
    // Print summary
    const { data: totalQuestions } = await supabase
      .from('questions')
      .select('id', { count: 'exact' });
    
    const { data: totalExercises } = await supabase
      .from('exercises')
      .select('id', { count: 'exact' });
    
    const { data: totalChapters } = await supabase
      .from('chapters')
      .select('id', { count: 'exact' })
      .eq('class_id', '7');
    
    console.log('\n📊 Summary:');
    console.log(`   Chapters: ${totalChapters?.length || 0}`);
    console.log(`   Exercises: ${totalExercises?.length || 0}`);
    console.log(`   Questions: ${totalQuestions?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Error loading questions:', error);
  }
}

// Run the script
if (require.main === module) {
  loadQuestions()
    .then(() => {
      console.log('\n✅ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { loadQuestions, parseQuestionFile, cleanQuestionText }; 