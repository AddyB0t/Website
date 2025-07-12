-- zapup-website-2/chapters-schema.sql
-- Schema for chapters linked to state_school_books
-- This allows chapter-wise organization within books

-- Create state_school_chapters table
CREATE TABLE state_school_chapters (
  id VARCHAR(100) PRIMARY KEY,
  book_id VARCHAR(100) NOT NULL REFERENCES state_school_books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name VARCHAR(255),
  file_size INTEGER,
  page_start INTEGER,
  page_end INTEGER,
  uploaded_by VARCHAR(255), -- Admin user who uploaded
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE state_school_chapters ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow admin read access on state_school_chapters" ON state_school_chapters
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow admin insert on state_school_chapters" ON state_school_chapters
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin update on state_school_chapters" ON state_school_chapters
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin delete on state_school_chapters" ON state_school_chapters
  FOR DELETE TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_state_school_chapters_book_id ON state_school_chapters(book_id);
CREATE INDEX idx_state_school_chapters_chapter_number ON state_school_chapters(chapter_number);
CREATE INDEX idx_state_school_chapters_book_chapter ON state_school_chapters(book_id, chapter_number);
CREATE INDEX idx_state_school_chapters_uploaded_by ON state_school_chapters(uploaded_by);
CREATE INDEX idx_state_school_chapters_active ON state_school_chapters(is_active);
CREATE INDEX idx_state_school_chapters_created_at ON state_school_chapters(created_at);

-- Ensure unique chapter numbers within a book
CREATE UNIQUE INDEX idx_unique_chapter_per_book ON state_school_chapters(book_id, chapter_number) WHERE is_active = true;

-- Add trigger for updating timestamps
CREATE TRIGGER update_state_school_chapters_timestamp BEFORE UPDATE ON state_school_chapters
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Add constraint to ensure chapter_number is positive
ALTER TABLE state_school_chapters ADD CONSTRAINT check_positive_chapter_number CHECK (chapter_number > 0);

-- Add constraint to ensure valid page range
ALTER TABLE state_school_chapters ADD CONSTRAINT check_valid_page_range CHECK (page_start IS NULL OR page_end IS NULL OR page_start <= page_end); 