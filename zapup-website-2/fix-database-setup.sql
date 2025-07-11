-- Fix Database Setup for Question Usage Tracking
-- This script adds missing columns and creates the question usage tracking system

-- 1. First, add subscription_type column if it doesn't exist
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(32) NOT NULL DEFAULT 'explorer';

-- 2. Create question_usage table if it doesn't exist
CREATE TABLE IF NOT EXISTS question_usage (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Clerk user ID
  subject_id VARCHAR(50) NOT NULL, -- Subject (mathematics, science, etc.)
  class_id VARCHAR(20) NOT NULL, -- Class level (6, 7, 8, etc.)
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Date of usage (for daily tracking)
  questions_asked INTEGER DEFAULT 0, -- Number of questions asked that day
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure one record per user per subject per class per date
  UNIQUE(user_id, subject_id, class_id, usage_date)
);

-- 3. Enable Row Level Security if not already enabled
ALTER TABLE question_usage ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own question usage" ON question_usage;
DROP POLICY IF EXISTS "Users can insert own question usage" ON question_usage;
DROP POLICY IF EXISTS "Users can update own question usage" ON question_usage;

-- 5. Create simplified policies that work with Clerk
CREATE POLICY "Allow full access to question_usage" ON question_usage FOR ALL USING (true) WITH CHECK (true);

-- 6. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_question_usage_user_date ON question_usage(user_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_question_usage_subject_class ON question_usage(subject_id, class_id);

-- 7. Create or replace the update timestamp function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger for updating timestamps
DROP TRIGGER IF EXISTS update_question_usage_timestamp ON question_usage;
CREATE TRIGGER update_question_usage_timestamp 
BEFORE UPDATE ON question_usage
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 9. Create or replace the increment usage function
CREATE OR REPLACE FUNCTION increment_question_usage(
  p_user_id VARCHAR(255),
  p_subject_id VARCHAR(50),
  p_class_id VARCHAR(20)
)
RETURNS TABLE(
  current_usage INTEGER,
  max_allowed INTEGER,
  remaining INTEGER,
  can_ask BOOLEAN
) AS $$
DECLARE
  v_current_usage INTEGER := 0;
  v_max_allowed INTEGER := 5; -- Default for explorer plan
  v_remaining INTEGER;
  v_can_ask BOOLEAN;
BEGIN
  -- Get or create usage record for today
  INSERT INTO question_usage (user_id, subject_id, class_id, usage_date, questions_asked)
  VALUES (p_user_id, p_subject_id, p_class_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, subject_id, class_id, usage_date)
  DO UPDATE SET 
    questions_asked = question_usage.questions_asked + 1,
    updated_at = CURRENT_TIMESTAMP
  RETURNING questions_asked INTO v_current_usage;
  
  -- Calculate remaining and check if user can ask more questions
  v_remaining := GREATEST(0, v_max_allowed - v_current_usage);
  v_can_ask := v_current_usage <= v_max_allowed;
  
  RETURN QUERY SELECT v_current_usage, v_max_allowed, v_remaining, v_can_ask;
END;
$$ LANGUAGE plpgsql;

-- 10. Create or replace the check usage function
CREATE OR REPLACE FUNCTION check_question_usage(
  p_user_id VARCHAR(255),
  p_subject_id VARCHAR(50),
  p_class_id VARCHAR(20)
)
RETURNS TABLE(
  current_usage INTEGER,
  max_allowed INTEGER,
  remaining INTEGER,
  can_ask BOOLEAN
) AS $$
DECLARE
  v_current_usage INTEGER := 0;
  v_max_allowed INTEGER := 5; -- Default for explorer plan
  v_remaining INTEGER;
  v_can_ask BOOLEAN;
BEGIN
  -- Get current usage for today
  SELECT COALESCE(questions_asked, 0) INTO v_current_usage
  FROM question_usage 
  WHERE user_id = p_user_id 
    AND subject_id = p_subject_id 
    AND class_id = p_class_id 
    AND usage_date = CURRENT_DATE;
  
  -- Calculate remaining and check if user can ask more questions
  v_remaining := GREATEST(0, v_max_allowed - v_current_usage);
  v_can_ask := v_current_usage < v_max_allowed;
  
  RETURN QUERY SELECT v_current_usage, v_max_allowed, v_remaining, v_can_ask;
END;
$$ LANGUAGE plpgsql;

-- 11. Grant necessary permissions
GRANT ALL ON question_usage TO postgres;
GRANT USAGE ON SEQUENCE question_usage_id_seq TO postgres;

-- 12. Test the setup by checking if functions exist
DO $$
BEGIN
    -- Test check function
    PERFORM * FROM check_question_usage('test-user', 'mathematics', '7');
    RAISE NOTICE 'check_question_usage function created successfully';
    
    -- Test increment function  
    PERFORM * FROM increment_question_usage('test-user', 'mathematics', '7');
    RAISE NOTICE 'increment_question_usage function created successfully';
    
    -- Clean up test data
    DELETE FROM question_usage WHERE user_id = 'test-user';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error testing functions: %', SQLERRM;
END $$;

-- 13. Show current status
SELECT 
    'question_usage table' as component,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'question_usage') 
         THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'subscription_type column' as component,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_preferences' AND column_name = 'subscription_type') 
         THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'increment_question_usage function' as component,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'increment_question_usage') 
         THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'check_question_usage function' as component,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'check_question_usage') 
         THEN 'EXISTS' ELSE 'MISSING' END as status; 