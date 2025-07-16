-- User Preferences Schema for ZapUp Website
-- Run this script to add user preferences functionality to your existing database

-- Create user_preferences table for storing user academic preferences and profile data
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL, -- Clerk user ID
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  school_board VARCHAR(50) CHECK (school_board IN ('CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other')),
  class_level VARCHAR(20) CHECK (class_level IN ('6', '7', '8', '9', '10', '11', '12')),
  stream VARCHAR(20) CHECK (stream IN ('Science', 'Commerce', 'Arts')), -- Only for classes 11-12
  state VARCHAR(100), -- Indian state selection
  city VARCHAR(100), -- City selection from the chosen state
  board_type VARCHAR(50) CHECK (board_type IN ('CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other')), -- Educational board type
  school VARCHAR(255), -- Selected school from state, city, and board type
  profile_picture_url TEXT, -- URL to stored profile picture
  profile_picture_filename VARCHAR(255), -- Original filename
  profile_picture_size INTEGER, -- File size in bytes
  profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user preferences - users can only access their own data
-- Note: Replace 'auth.uid()' with your authentication method if not using Supabase Auth
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own preferences" ON user_preferences FOR DELETE USING (auth.uid()::text = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_class_stream ON user_preferences(class_level, stream);
CREATE INDEX IF NOT EXISTS idx_user_preferences_state ON user_preferences(state);
CREATE INDEX IF NOT EXISTS idx_user_preferences_city ON user_preferences(city);
CREATE INDEX IF NOT EXISTS idx_user_preferences_board_type ON user_preferences(board_type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_school ON user_preferences(school);

-- Composite indexes for common queries in the new workflow
CREATE INDEX IF NOT EXISTS idx_user_preferences_state_city ON user_preferences(state, city);
CREATE INDEX IF NOT EXISTS idx_user_preferences_city_board_type ON user_preferences(city, board_type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_state_city_board ON user_preferences(state, city, board_type);

-- Add trigger for updating timestamps
CREATE TRIGGER update_user_preferences_timestamp BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Create storage bucket for user uploads (if using Supabase)
-- Run this in Supabase dashboard or via API:
/*
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', true);

-- Set up storage policies
CREATE POLICY "Users can upload their own files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own files" ON storage.objects FOR SELECT USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Public can view profile pictures" ON storage.objects FOR SELECT USING (bucket_id = 'user-uploads');
*/

-- Sample data (optional - remove in production)
-- INSERT INTO user_preferences (user_id, email, first_name, last_name, school_board, class_level, stream, state, school, profile_complete) VALUES 
-- ('sample_user_1', 'student@example.com', 'John', 'Doe', 'CBSE', '11', 'Science', 'Delhi', 'Delhi Public School, R.K. Puram', true),
-- ('sample_user_2', 'student2@example.com', 'Jane', 'Smith', 'ICSE', '10', NULL, 'Maharashtra', 'Cathedral and John Connon School', true); 