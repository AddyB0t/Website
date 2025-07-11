-- Simplified Schema for ZapUp Learning Platform
-- Just: subjects → classes → questions

-- Create subjects table
CREATE TABLE subjects (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE classes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  class_id VARCHAR(50) REFERENCES classes(id) ON DELETE CASCADE,
  chapter VARCHAR(255),  -- Store chapter name as simple text
  section VARCHAR(255),  -- Store section name as simple text
  order_index INTEGER,
  difficulty VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create solutions table (for AI-generated answers)
CREATE TABLE solutions (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;

-- Create policies for full access (read/write for everyone including anon users)
-- This allows the loading script to work and website to function

-- Subjects policies
CREATE POLICY "Allow all operations on subjects" ON subjects FOR ALL USING (true) WITH CHECK (true);

-- Classes policies  
CREATE POLICY "Allow all operations on classes" ON classes FOR ALL USING (true) WITH CHECK (true);

-- Questions policies
CREATE POLICY "Allow all operations on questions" ON questions FOR ALL USING (true) WITH CHECK (true);

-- Solutions policies
CREATE POLICY "Allow all operations on solutions" ON solutions FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_classes_subject_id ON classes(subject_id);
CREATE INDEX idx_questions_class_id ON questions(class_id);
CREATE INDEX idx_questions_chapter ON questions(class_id, chapter);
CREATE INDEX idx_questions_order ON questions(class_id, chapter, order_index);
CREATE INDEX idx_solutions_question_id ON solutions(question_id);

-- Insert basic data
INSERT INTO subjects (id, name, description) VALUES 
('mathematics', 'Mathematics', 'Learn essential mathematical concepts with step-by-step explanations'),
('science', 'Science', 'Explore physics, chemistry, and biology with interactive experiments');

INSERT INTO classes (id, name, subject_id) VALUES 
('6', 'Class 6', 'mathematics'),
('7', 'Class 7', 'mathematics'),
('8', 'Class 8', 'mathematics'),
('9', 'Class 9', 'mathematics'),
('10', 'Class 10', 'mathematics'); 