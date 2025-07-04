-- Comprehensive Row Level Security (RLS) Policies for all tables
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- USER PREFERENCES TABLE
-- =============================================================================

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences
  FOR DELETE TO authenticated
  USING (auth.uid()::text = user_id);

-- =============================================================================
-- EDUCATIONAL CONTENT TABLES (PUBLIC READ ACCESS)
-- =============================================================================

-- SUBJECTS TABLE
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to subjects" ON subjects
  FOR SELECT TO anon, authenticated
  USING (true);

-- CLASSES TABLE  
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to classes" ON classes
  FOR SELECT TO anon, authenticated
  USING (true);

-- BOOKS TABLE
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to books" ON books
  FOR SELECT TO anon, authenticated
  USING (true);

-- CHAPTERS TABLE
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to chapters" ON chapters
  FOR SELECT TO anon, authenticated
  USING (true);

-- EXERCISES TABLE
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to exercises" ON exercises
  FOR SELECT TO anon, authenticated
  USING (true);

-- QUESTIONS TABLE
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to questions" ON questions
  FOR SELECT TO anon, authenticated
  USING (true);

-- SOLUTIONS TABLE
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to solutions" ON solutions
  FOR SELECT TO anon, authenticated
  USING (true);

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Grant permissions for user_preferences
GRANT ALL ON user_preferences TO authenticated;
GRANT USAGE ON SEQUENCE user_preferences_id_seq TO authenticated;

-- Grant read permissions for educational content
GRANT SELECT ON subjects TO anon, authenticated;
GRANT SELECT ON classes TO anon, authenticated;
GRANT SELECT ON books TO anon, authenticated;
GRANT SELECT ON chapters TO anon, authenticated;
GRANT SELECT ON exercises TO anon, authenticated;
GRANT SELECT ON questions TO anon, authenticated;
GRANT SELECT ON solutions TO anon, authenticated;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check if policies are created (run these to verify)
-- SELECT schemaname, tablename, policyname, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public';

-- Check if RLS is enabled
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' AND rowsecurity = true; 