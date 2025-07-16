-- Website/zapup-website-2/migrations/add-city-board-type-columns.sql
-- Migration to add city and board_type columns for new profile workflow
-- State → City → Board Type → School workflow implementation

-- Add city column
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Add board_type column (separate from school_board for cleaner workflow)
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS board_type VARCHAR(50) CHECK (board_type IN ('CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_city ON user_preferences(city);
CREATE INDEX IF NOT EXISTS idx_user_preferences_board_type ON user_preferences(board_type);

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_state_city ON user_preferences(state, city);
CREATE INDEX IF NOT EXISTS idx_user_preferences_city_board_type ON user_preferences(city, board_type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_state_city_board ON user_preferences(state, city, board_type);

-- Update existing records to have empty city and board_type
-- This ensures all existing users will need to complete their profiles with new workflow
UPDATE user_preferences 
SET profile_complete = false 
WHERE city IS NULL OR board_type IS NULL;

-- Add comments to new columns
COMMENT ON COLUMN user_preferences.city IS 'City selection from the chosen state for user location';
COMMENT ON COLUMN user_preferences.board_type IS 'Educational board type selection (CBSE, ICSE, etc.) before school selection';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_preferences' 
AND column_name IN ('city', 'board_type'); 