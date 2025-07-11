-- Question Usage Tracking Schema for Daily Limits
-- Run this script to add daily question usage tracking functionality

-- Create question_usage table for tracking daily question usage by user and subject
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

-- Enable Row Level Security
ALTER TABLE question_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for question usage - users can only access their own data
CREATE POLICY "Users can view own question usage" ON question_usage FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own question usage" ON question_usage FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own question usage" ON question_usage FOR UPDATE USING (auth.uid()::text = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_question_usage_user_date ON question_usage(user_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_question_usage_subject_class ON question_usage(subject_id, class_id);

-- Add trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_usage_timestamp 
BEFORE UPDATE ON question_usage
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Create function to increment daily question usage
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

-- Create function to check daily question usage without incrementing
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