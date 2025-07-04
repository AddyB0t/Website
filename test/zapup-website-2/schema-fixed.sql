-- zapup-website-2/schema-fixed.sql
-- Fixed schema for ZapUp Learning content database
-- This version works with Supabase managed database

-- Create subjects table
CREATE TABLE subjects (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE books (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
  image VARCHAR(255),
  publisher VARCHAR(100),
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE classes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  book_id VARCHAR(50) REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chapters table
CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  class_id VARCHAR(50) REFERENCES classes(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create exercises table
CREATE TABLE exercises (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  exercise_id VARCHAR(50) REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  difficulty VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create solutions table
CREATE TABLE solutions (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_preferences table for storing user academic preferences and profile data
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL, -- Clerk user ID
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  school_board VARCHAR(50) CHECK (school_board IN ('CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other')),
  class_level VARCHAR(20) CHECK (class_level IN ('6', '7', '8', '9', '10', '11', '12')),
  stream VARCHAR(20) CHECK (stream IN ('Science', 'Commerce', 'Arts')), -- Only for classes 11-12
  profile_picture_url TEXT, -- URL to stored profile picture
  profile_picture_filename VARCHAR(255), -- Original filename
  profile_picture_size INTEGER, -- File size in bytes
  profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security on tables (instead of database level)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (adjust as needed for your use case)
CREATE POLICY "Allow public read access on subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow public read access on classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Allow public read access on exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Allow public read access on questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on solutions" ON solutions FOR SELECT USING (true);

-- User preferences policies - users can only access their own data
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own preferences" ON user_preferences FOR DELETE USING (auth.uid()::text = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_books_subject_id ON books(subject_id);
CREATE INDEX idx_classes_book_id ON classes(book_id);
CREATE INDEX idx_chapters_class_id ON chapters(class_id);
CREATE INDEX idx_exercises_chapter_id ON exercises(chapter_id);
CREATE INDEX idx_questions_exercise_id ON questions(exercise_id);
CREATE INDEX idx_solutions_question_id ON solutions(question_id);

-- Add ordered indexes
CREATE INDEX idx_chapters_order ON chapters(class_id, order_index);
CREATE INDEX idx_exercises_order ON exercises(chapter_id, order_index);
CREATE INDEX idx_questions_order ON questions(exercise_id, order_index);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_class_stream ON user_preferences(class_level, stream);

-- Sample data for testing (you can remove this in production)
INSERT INTO subjects (id, name, description) VALUES 
('mathematics', 'Mathematics', 'Learn essential mathematical concepts with step-by-step explanations'),
('science', 'Science', 'Explore physics, chemistry, and biology with interactive experiments');

INSERT INTO books (id, title, subject_id, publisher, year) VALUES 
('ncert-math', 'NCERT Mathematics', 'mathematics', 'NCERT', 2023),
('ncert-science', 'NCERT Science', 'science', 'NCERT', 2023);

INSERT INTO classes (id, name, book_id) VALUES 
('6', 'Class 6', 'ncert-math'),
('7', 'Class 7', 'ncert-math'),
('8', 'Class 8', 'ncert-math');

-- Auto-update timestamps function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updating timestamps
CREATE TRIGGER update_subjects_timestamp BEFORE UPDATE ON subjects
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_books_timestamp BEFORE UPDATE ON books
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_classes_timestamp BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_chapters_timestamp BEFORE UPDATE ON chapters
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_exercises_timestamp BEFORE UPDATE ON exercises
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_questions_timestamp BEFORE UPDATE ON questions
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_solutions_timestamp BEFORE UPDATE ON solutions
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_user_preferences_timestamp BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE PROCEDURE update_timestamp(); 