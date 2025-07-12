-- zapup-website-2/disable-rls-chapters.sql
-- Disable Row Level Security for state_school_chapters table
-- This allows unrestricted access for admin uploads

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin read access on state_school_chapters" ON state_school_chapters;
DROP POLICY IF EXISTS "Allow admin insert on state_school_chapters" ON state_school_chapters;
DROP POLICY IF EXISTS "Allow admin update on state_school_chapters" ON state_school_chapters;
DROP POLICY IF EXISTS "Allow admin delete on state_school_chapters" ON state_school_chapters;

-- Disable Row Level Security
ALTER TABLE state_school_chapters DISABLE ROW LEVEL SECURITY;

-- Also disable RLS for state_school_books if needed
ALTER TABLE state_school_books DISABLE ROW LEVEL SECURITY;

-- Drop existing policies for state_school_books
DROP POLICY IF EXISTS "Allow admin read access on state_school_books" ON state_school_books;
DROP POLICY IF EXISTS "Allow admin insert on state_school_books" ON state_school_books;
DROP POLICY IF EXISTS "Allow admin update on state_school_books" ON state_school_books;
DROP POLICY IF EXISTS "Allow admin delete on state_school_books" ON state_school_books; 