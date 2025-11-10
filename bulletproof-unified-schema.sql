-- BULLETPROOF UNIFIED DATABASE SCHEMA
-- Designed to work with all APIs, frontend components, and admin workflows
-- Resolves all identified conflicts and missing dependencies

-- ============================================================================
-- CORE REFERENCE TABLES
-- ============================================================================

-- States table for hierarchical filtering
CREATE TABLE IF NOT EXISTS states (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50) DEFAULT 'India',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Schools table (unified from multiple schemas)
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  state_id INTEGER REFERENCES states(id),
  city VARCHAR(100),
  school_type VARCHAR(100) NOT NULL CHECK (school_type IN ('CBSE (Central Board of Secondary Education)', 'ICSE (Indian Certificate of Secondary Education)')),
  established_year INTEGER,
  principal_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  website VARCHAR(255),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Streams table for class 11-12 specializations
CREATE TABLE IF NOT EXISTS streams (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  class_levels INTEGER[] NOT NULL DEFAULT '{11,12}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('Core', 'Elective', 'Optional', 'Language', 'Science', 'Mathematics', 'Social', 'Arts')),
  class_levels INTEGER[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stream-Subject relationship for class 11-12
CREATE TABLE IF NOT EXISTS stream_subjects (
  id SERIAL PRIMARY KEY,
  stream_id INTEGER REFERENCES streams(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  is_mandatory BOOLEAN DEFAULT false,
  is_elective BOOLEAN DEFAULT true,
  class_levels INTEGER[] NOT NULL DEFAULT '{11,12}',
  UNIQUE(stream_id, subject_id)
);

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

-- Fixed user_preferences table with ALL expected columns
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  school_type VARCHAR(100) CHECK (school_type IN ('CBSE (Central Board of Secondary Education)', 'ICSE (Indian Certificate of Secondary Education)')),
  class_level VARCHAR(10) CHECK (class_level IN ('6', '7', '8', '9', '10', '11', '12')),
  stream VARCHAR(50),
  state VARCHAR(100), -- FIXED: Added missing column
  school VARCHAR(255), -- FIXED: Added missing column
  profile_picture_url TEXT,
  profile_picture_filename VARCHAR(255),
  profile_picture_size INTEGER,
  profile_complete BOOLEAN DEFAULT false,
  subscription_type VARCHAR(50) DEFAULT 'explorer' CHECK (subscription_type IN ('explorer', 'scholar', 'achiever', 'genius_plus')), -- FIXED: Added missing column with validation
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- CONTENT MANAGEMENT - UNIFIED BOOK SYSTEM
-- ============================================================================

-- Unified books table (replaces both books and state_school_books)
CREATE TABLE IF NOT EXISTS books (
  id VARCHAR(255) PRIMARY KEY, -- Support both auto-generated and custom IDs
  title VARCHAR(500) NOT NULL,
  subject_id INTEGER REFERENCES subjects(id),
  school_id INTEGER REFERENCES schools(id),
  stream_id INTEGER REFERENCES streams(id),
  class_level VARCHAR(10) NOT NULL CHECK (class_level IN ('6', '7', '8', '9', '10', '11', '12')),
  school_type VARCHAR(100) NOT NULL CHECK (school_type IN ('CBSE (Central Board of Secondary Education)', 'ICSE (Indian Certificate of Secondary Education)')),
  author VARCHAR(255),
  publisher VARCHAR(255),
  edition VARCHAR(50),
  publication_year INTEGER,
  language VARCHAR(50) DEFAULT 'English',
  description TEXT,
  file_url TEXT,
  file_name VARCHAR(255),
  file_size BIGINT,
  uploaded_by VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Unified chapters table (replaces both chapters and state_school_chapters)
CREATE TABLE IF NOT EXISTS chapters (
  id VARCHAR(255) PRIMARY KEY, -- Support both auto-generated and custom IDs
  book_id VARCHAR(255) REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name VARCHAR(255),
  file_size BIGINT,
  page_start INTEGER,
  page_end INTEGER,
  total_questions INTEGER DEFAULT 0,
  total_examples INTEGER DEFAULT 0,
  total_exercises INTEGER DEFAULT 0,
  uploaded_by VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);

-- ============================================================================
-- QUESTIONS SYSTEM - UNIFIED STRUCTURE
-- ============================================================================

-- Exercises table for organizing questions
CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  chapter_id VARCHAR(255) REFERENCES chapters(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  exercise_number INTEGER,
  description TEXT,
  exercise_type VARCHAR(50) CHECK (exercise_type IN ('Practice', 'Example', 'Review', 'Assessment')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Unified questions table with ALL expected columns
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  -- Support both chapter string and chapter_id foreign key (FIXED CONFLICT)
  chapter VARCHAR(500), -- For APIs expecting chapter name
  chapter_id VARCHAR(255) REFERENCES chapters(id), -- For APIs expecting foreign key
  exercise_id INTEGER REFERENCES exercises(id),
  section VARCHAR(255) DEFAULT 'General', -- For section-based organization
  
  -- Question content
  text TEXT NOT NULL,
  question_number INTEGER,
  question_type VARCHAR(50) CHECK (question_type IN ('MCQ', 'Short Answer', 'Long Answer', 'Numerical', 'True/False', 'Fill in the Blank')),
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  is_example BOOLEAN DEFAULT false,
  
  -- Metadata
  page_number INTEGER,
  topics TEXT[],
  keywords TEXT[],
  answer TEXT,
  explanation TEXT,
  hints TEXT[],
  
  -- Organization
  display_order INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0, -- For backward compatibility
  
  -- Legacy support (FIXED CONFLICT)
  class_id VARCHAR(10), -- For APIs expecting class_id
  subject VARCHAR(100), -- For APIs expecting subject string
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Question availability tracking for real-time updates
CREATE TABLE IF NOT EXISTS question_availability (
  id SERIAL PRIMARY KEY,
  class_id VARCHAR(10) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  chapter VARCHAR(500) NOT NULL,
  section VARCHAR(255) NOT NULL DEFAULT 'General',
  question_count INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicates
  UNIQUE(class_id, subject, chapter, section)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_question_availability_lookup ON question_availability(class_id, subject, is_available);
CREATE INDEX IF NOT EXISTS idx_question_availability_updated ON question_availability(last_updated);

-- ============================================================================
-- VIEWS FOR API COMPATIBILITY
-- ============================================================================

-- Stream subjects view for streams API
CREATE OR REPLACE VIEW stream_subjects_view AS
SELECT 
  ss.stream_id,
  s.name as stream_name,
  s.code as stream_code,
  s.class_levels,
  ss.subject_id,
  sub.name as subject_name,
  sub.code as subject_code,
  sub.category as subject_category,
  ss.is_mandatory,
  ss.is_elective
FROM stream_subjects ss
JOIN streams s ON ss.stream_id = s.id
JOIN subjects sub ON ss.subject_id = sub.id
WHERE s.is_active = true AND sub.is_active = true;

-- School stats view for schools API
CREATE OR REPLACE VIEW school_stats AS
SELECT 
  sc.id as school_id,
  sc.name as school_name,
  sc.code as school_code,
  sc.city,
  st.name as state,
  sc.school_type,
  COALESCE(book_stats.total_books, 0) as total_books,
  COALESCE(book_stats.total_chapters, 0) as total_chapters,
  COALESCE(book_stats.total_questions, 0) as total_questions,
  COALESCE(book_stats.total_exercises, 0) as total_exercises,
  COALESCE(book_stats.total_examples, 0) as total_examples,
  COALESCE(stream_stats.total_streams, 0) as total_streams,
  COALESCE(subject_stats.total_subjects, 0) as total_subjects
FROM schools sc
LEFT JOIN states st ON sc.state_id = st.id
LEFT JOIN (
  SELECT 
    b.school_id,
    COUNT(DISTINCT b.id) as total_books,
    COUNT(DISTINCT c.id) as total_chapters,
    SUM(COALESCE(c.total_questions, 0)) as total_questions,
    SUM(COALESCE(c.total_exercises, 0)) as total_exercises,
    SUM(COALESCE(c.total_examples, 0)) as total_examples
  FROM books b
  LEFT JOIN chapters c ON b.id = c.book_id AND c.is_active = true
  WHERE b.is_active = true
  GROUP BY b.school_id
) book_stats ON sc.id = book_stats.school_id
LEFT JOIN (
  SELECT 
    b.school_id,
    COUNT(DISTINCT b.stream_id) as total_streams
  FROM books b
  WHERE b.is_active = true AND b.stream_id IS NOT NULL
  GROUP BY b.school_id
) stream_stats ON sc.id = stream_stats.school_id
LEFT JOIN (
  SELECT 
    b.school_id,
    COUNT(DISTINCT b.subject_id) as total_subjects
  FROM books b
  WHERE b.is_active = true AND b.subject_id IS NOT NULL
  GROUP BY b.school_id
) subject_stats ON sc.id = subject_stats.school_id;

-- School question summary view for questions unified API
CREATE OR REPLACE VIEW school_question_summary AS
SELECT 
  q.id,
  q.text as question_text,
  q.question_number,
  q.question_type,
  q.difficulty_level,
  q.is_example,
  q.page_number,
  q.topics,
  q.keywords,
  
  -- Chapter info
  COALESCE(q.chapter, c.title) as chapter_name,
  COALESCE(c.chapter_number, CAST(q.class_id AS INTEGER)) as chapter_number,
  
  -- Book info
  b.title as book_name,
  b.class_level,
  b.school_type,
  
  -- Exercise info
  e.name as exercise_name,
  e.exercise_number,
  
  -- School info  
  sc.id as school_id,
  sc.name as school_name,
  sc.code as school_code,
  sc.city as school_city,
  st.name as school_state,
  sc.school_type as school_board_type,
  
  -- Stream info
  str.id as stream_id,
  str.name as stream_name,
  str.code as stream_code,
  
  -- Subject info
  COALESCE(q.subject, sub.name) as subject,
  sub.name as subject_name,
  sub.code as subject_code,
  sub.category as subject_category,
  
  q.display_order,
  q.order_index
FROM questions q
LEFT JOIN chapters c ON q.chapter_id = c.id
LEFT JOIN books b ON c.book_id = b.id
LEFT JOIN exercises e ON q.exercise_id = e.id
LEFT JOIN schools sc ON b.school_id = sc.id
LEFT JOIN states st ON sc.state_id = st.id
LEFT JOIN streams str ON b.stream_id = str.id
LEFT JOIN subjects sub ON b.subject_id = sub.id
WHERE q.is_active = true;

-- Class subject stream stats view for stats API
CREATE OR REPLACE VIEW class_subject_stream_stats AS
SELECT 
  b.class_level,
  sub.name as subject,
  b.school_type,
  str.id as stream_id,
  str.name as stream_name,
  COUNT(DISTINCT b.id) as total_books,
  COUNT(DISTINCT c.id) as total_chapters,
  SUM(COALESCE(c.total_questions, 0)) as total_questions,
  SUM(COALESCE(c.total_examples, 0)) as total_examples,
  SUM(COALESCE(c.total_exercises, 0)) as total_exercises
FROM books b
LEFT JOIN chapters c ON b.id = c.book_id AND c.is_active = true
LEFT JOIN subjects sub ON b.subject_id = sub.id
LEFT JOIN streams str ON b.stream_id = str.id
WHERE b.is_active = true
GROUP BY b.class_level, sub.name, b.school_type, str.id, str.name;

-- ============================================================================
-- TRIGGERS FOR DATA CONSISTENCY
-- ============================================================================

-- Update chapter statistics when questions change
CREATE OR REPLACE FUNCTION update_chapter_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update chapter statistics
  UPDATE chapters SET
    total_questions = (
      SELECT COUNT(*) FROM questions 
      WHERE chapter_id = COALESCE(NEW.chapter_id, OLD.chapter_id) AND is_active = true
    ),
    total_examples = (
      SELECT COUNT(*) FROM questions 
      WHERE chapter_id = COALESCE(NEW.chapter_id, OLD.chapter_id) AND is_example = true AND is_active = true
    ),
    total_exercises = (
      SELECT COUNT(DISTINCT exercise_id) FROM questions 
      WHERE chapter_id = COALESCE(NEW.chapter_id, OLD.chapter_id) AND exercise_id IS NOT NULL AND is_active = true
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.chapter_id, OLD.chapter_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS questions_stats_trigger ON questions;
CREATE TRIGGER questions_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_chapter_stats();

-- Trigger to sync chapter name to questions
CREATE OR REPLACE FUNCTION sync_question_chapter_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.chapter_id IS NOT NULL THEN
    NEW.chapter := (SELECT title FROM chapters WHERE id = NEW.chapter_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_chapter_name_trigger ON questions;
CREATE TRIGGER sync_chapter_name_trigger
  BEFORE INSERT OR UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION sync_question_chapter_name();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_complete ON user_preferences(profile_complete);

-- Books indexes
CREATE INDEX IF NOT EXISTS idx_books_school_id ON books(school_id);
CREATE INDEX IF NOT EXISTS idx_books_subject_id ON books(subject_id);
CREATE INDEX IF NOT EXISTS idx_books_stream_id ON books(stream_id);
CREATE INDEX IF NOT EXISTS idx_books_class_level ON books(class_level);
CREATE INDEX IF NOT EXISTS idx_books_school_type ON books(school_type);
CREATE INDEX IF NOT EXISTS idx_books_active ON books(is_active);

-- Chapters indexes
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_number ON chapters(chapter_number);

-- Questions indexes
CREATE INDEX IF NOT EXISTS idx_questions_chapter_id ON questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_questions_exercise_id ON questions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_questions_class_id ON questions(class_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);

-- Schools indexes
CREATE INDEX IF NOT EXISTS idx_schools_state_id ON schools(state_id);
CREATE INDEX IF NOT EXISTS idx_schools_school_type ON schools(school_type);
CREATE INDEX IF NOT EXISTS idx_schools_active ON schools(is_active);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own preferences
CREATE POLICY user_preferences_policy ON user_preferences
  FOR ALL USING (auth.uid()::text = user_id);

-- ============================================================================
-- SAMPLE DATA INSERTS
-- ============================================================================

-- Insert sample states
INSERT INTO states (code, name) VALUES 
('DL', 'Delhi'),
('MH', 'Maharashtra'), 
('KA', 'Karnataka'),
('TN', 'Tamil Nadu'),
('UP', 'Uttar Pradesh')
ON CONFLICT (code) DO NOTHING;

-- Insert sample streams
INSERT INTO streams (code, name, class_levels) VALUES 
('SCI_MED', 'Science Medical', '{11,12}'),
('SCI_NONMED', 'Science Non-Medical', '{11,12}'),
('COM', 'Commerce', '{11,12}'),
('HUM', 'Humanities', '{11,12}')
ON CONFLICT (code) DO NOTHING;

-- Insert comprehensive Indian curriculum subjects
INSERT INTO subjects (code, name, category, class_levels) VALUES 
-- Core subjects for all/most classes
('MATH', 'Mathematics', 'Core', '{6,7,8,9,10,11,12}'),
('ENG', 'English', 'Language', '{6,7,8,9,10,11,12}'),
('HINDI', 'Hindi', 'Language', '{6,7,8,9,10,11,12}'),

-- Science subjects
('SCI', 'Science', 'Core', '{6,7,8,9,10}'),
('PHY', 'Physics', 'Science', '{11,12}'),
('CHEM', 'Chemistry', 'Science', '{11,12}'),
('BIO', 'Biology', 'Science', '{11,12}'),

-- Social studies
('SST', 'Social Science', 'Core', '{6,7,8,9,10}'),
('HIST', 'History', 'Social', '{11,12}'),
('GEO', 'Geography', 'Social', '{11,12}'),
('POLSCI', 'Political Science', 'Social', '{11,12}'),
('PSY', 'Psychology', 'Social', '{11,12}'),
('SOC', 'Sociology', 'Social', '{11,12}'),

-- Commerce subjects
('ACC', 'Accountancy', 'Core', '{11,12}'),
('BS', 'Business Studies', 'Core', '{11,12}'),
('ECO', 'Economics', 'Core', '{11,12}'),

-- Languages
('SANS', 'Sanskrit', 'Language', '{6,7,8,9,10,11,12}'),
('FR', 'French', 'Language', '{6,7,8,9,10,11,12}'),
('GER', 'German', 'Language', '{6,7,8,9,10,11,12}'),

-- Other subjects
('CS', 'Computer Science', 'Elective', '{6,7,8,9,10,11,12}'),
('PE', 'Physical Education', 'Elective', '{6,7,8,9,10,11,12}'),
('HS', 'Home Science', 'Elective', '{6,7,8,9,10,11,12}'),
('FA', 'Fine Arts', 'Arts', '{6,7,8,9,10,11,12}'),
('MUS', 'Music', 'Arts', '{6,7,8,9,10,11,12}')
ON CONFLICT (code) DO NOTHING;

-- Link streams and subjects
INSERT INTO stream_subjects (stream_id, subject_id, is_mandatory) VALUES 
(1, 4, true), -- Science Medical - Physics
(1, 5, true), -- Science Medical - Chemistry  
(1, 6, true), -- Science Medical - Biology
(2, 4, true), -- Science Non-Medical - Physics
(2, 5, true), -- Science Non-Medical - Chemistry
(2, 1, true), -- Science Non-Medical - Mathematics
(3, 7, true), -- Commerce - Accountancy
(3, 8, true), -- Commerce - Economics
(3, 1, false), -- Commerce - Mathematics (elective)
(4, 9, true), -- Humanities - History
(4, 8, false) -- Humanities - Economics (elective)
ON CONFLICT (stream_id, subject_id) DO NOTHING;

-- ============================================================================
-- SCHEMA VALIDATION
-- ============================================================================

-- Check that all expected tables exist
DO $$
DECLARE
  missing_tables text[];
  expected_tables text[] := ARRAY[
    'states', 'schools', 'streams', 'subjects', 'stream_subjects',
    'user_preferences', 'books', 'chapters', 'exercises', 'questions'
  ];
  expected_table text;
BEGIN
  FOREACH expected_table IN ARRAY expected_tables
  LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = expected_table) THEN
      missing_tables := missing_tables || expected_table;
    END IF;
  END LOOP;
  
  IF array_length(missing_tables, 1) > 0 THEN
    RAISE NOTICE 'Missing tables: %', array_to_string(missing_tables, ', ');
  ELSE
    RAISE NOTICE 'All required tables exist!';
  END IF;
END $$;

-- Check that all expected views exist  
DO $$
DECLARE
  missing_views text[];
  expected_views text[] := ARRAY[
    'stream_subjects_view', 'school_stats', 'school_question_summary', 'class_subject_stream_stats'
  ];
  expected_view text;
BEGIN
  FOREACH expected_view IN ARRAY expected_views
  LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = expected_view) THEN
      missing_views := missing_views || expected_view;
    END IF;
  END LOOP;
  
  IF array_length(missing_views, 1) > 0 THEN
    RAISE NOTICE 'Missing views: %', array_to_string(missing_views, ', ');
  ELSE
    RAISE NOTICE 'All required views exist!';
  END IF;
END $$;

-- Verify user_preferences has all expected columns
DO $$
DECLARE
  missing_columns text[];
  expected_columns text[] := ARRAY[
    'user_id', 'school_type', 'class_level', 'stream', 'state', 'school', 
    'first_name', 'last_name', 'subscription_type', 'profile_complete'
  ];
  expected_column text;
BEGIN
  FOREACH expected_column IN ARRAY expected_columns
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'user_preferences' AND column_name = expected_column
    ) THEN
      missing_columns := missing_columns || expected_column;
    END IF;
  END LOOP;
  
  IF array_length(missing_columns, 1) > 0 THEN
    RAISE NOTICE 'user_preferences missing columns: %', array_to_string(missing_columns, ', ');
  ELSE
    RAISE NOTICE 'user_preferences has all required columns!';
  END IF;
END $$;

RAISE NOTICE 'Bulletproof unified schema setup complete!';