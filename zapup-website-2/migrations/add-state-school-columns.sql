-- Migration to add state and school columns to user_preferences table
-- Run this script if you have an existing database without these columns

-- Add state column
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- Add school column  
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS school VARCHAR(255);

-- Add index for state column for better query performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_state ON user_preferences(state);

-- Add index for school column for better query performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_school ON user_preferences(school);

-- Update existing records to have empty state and school (optional)
-- This ensures all existing users will need to complete their profiles
UPDATE user_preferences 
SET profile_complete = false 
WHERE state IS NULL OR school IS NULL;

-- Add comment to table
COMMENT ON COLUMN user_preferences.state IS 'Indian state selection for user location';
COMMENT ON COLUMN user_preferences.school IS 'Selected school from the state''s top schools list';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_preferences' 
AND column_name IN ('state', 'school'); 