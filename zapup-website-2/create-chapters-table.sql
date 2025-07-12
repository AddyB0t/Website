-- zapup-website-2/create-chapters-table.sql
-- Create chapters table without Row Level Security
-- Simple table creation for chapter management

-- Create state_school_chapters table
CREATE TABLE IF NOT EXISTS state_school_chapters (
  id VARCHAR(100) PRIMARY KEY,
  book_id VARCHAR(100) NOT NULL,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name VARCHAR(255),
  file_size INTEGER,
  page_start INTEGER,
  page_end INTEGER,
  uploaded_by VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_state_school_chapters_book_id ON state_school_chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_state_school_chapters_chapter_number ON state_school_chapters(chapter_number);
CREATE INDEX IF NOT EXISTS idx_state_school_chapters_book_chapter ON state_school_chapters(book_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_state_school_chapters_active ON state_school_chapters(is_active);

-- Create unique constraint for chapter numbers within a book
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_chapter_per_book ON state_school_chapters(book_id, chapter_number) WHERE is_active = true;

-- Add constraints (drop first if exists, then add)
DO $$
BEGIN
    -- Add positive chapter number constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_positive_chapter_number') THEN
        ALTER TABLE state_school_chapters ADD CONSTRAINT check_positive_chapter_number CHECK (chapter_number > 0);
    END IF;
    
    -- Add valid page range constraint
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_valid_page_range') THEN
        ALTER TABLE state_school_chapters ADD CONSTRAINT check_valid_page_range CHECK (page_start IS NULL OR page_end IS NULL OR page_start <= page_end);
    END IF;
END $$;

-- Create trigger function if not exists
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updating timestamps
DROP TRIGGER IF EXISTS update_state_school_chapters_timestamp ON state_school_chapters;
CREATE TRIGGER update_state_school_chapters_timestamp 
BEFORE UPDATE ON state_school_chapters
FOR EACH ROW EXECUTE PROCEDURE update_timestamp(); 