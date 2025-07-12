-- zapup-website-2/state-school-books-schema.sql
-- New table for state-school-class-subject book uploads
-- This is separate from the existing books table

-- Create state_school_books table
CREATE TABLE state_school_books (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject_id VARCHAR(50) NOT NULL,
  state VARCHAR(100) NOT NULL,
  school VARCHAR(255) NOT NULL,
  class_level VARCHAR(20) NOT NULL,
  publisher VARCHAR(100),
  year INTEGER,
  file_url TEXT,
  file_name VARCHAR(255),
  file_size INTEGER,
  uploaded_by VARCHAR(255), -- Admin user who uploaded
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE state_school_books ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow admin read access on state_school_books" ON state_school_books
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow admin insert on state_school_books" ON state_school_books
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin update on state_school_books" ON state_school_books
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin delete on state_school_books" ON state_school_books
  FOR DELETE TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_state_school_books_subject ON state_school_books(subject_id);
CREATE INDEX idx_state_school_books_state ON state_school_books(state);
CREATE INDEX idx_state_school_books_school ON state_school_books(school);
CREATE INDEX idx_state_school_books_class ON state_school_books(class_level);
CREATE INDEX idx_state_school_books_state_school ON state_school_books(state, school);
CREATE INDEX idx_state_school_books_state_school_class ON state_school_books(state, school, class_level);
CREATE INDEX idx_state_school_books_subject_class ON state_school_books(subject_id, class_level);
CREATE INDEX idx_state_school_books_uploaded_by ON state_school_books(uploaded_by);
CREATE INDEX idx_state_school_books_active ON state_school_books(is_active);

-- Auto-update timestamps function (if not already exists)
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updating timestamps
CREATE TRIGGER update_state_school_books_timestamp BEFORE UPDATE ON state_school_books
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Sample data for common subjects
INSERT INTO subjects (id, name, description) VALUES 
('mathematics', 'Mathematics', 'Learn essential mathematical concepts with step-by-step explanations'),
('science', 'Science', 'Explore physics, chemistry, and biology with interactive experiments'),
('english', 'English', 'Develop language skills through literature and grammar'),
('social-studies', 'Social Studies', 'Understanding history, geography, and civics'),
('hindi', 'Hindi', 'Hindi language and literature'),
('computer-science', 'Computer Science', 'Programming and computer fundamentals')
ON CONFLICT (id) DO NOTHING; 