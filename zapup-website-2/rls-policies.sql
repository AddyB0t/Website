-- Row Level Security (RLS) Policies for user_preferences table
-- This fixes the "new row violates row-level security policy" error

-- 1. Enable RLS on user_preferences (if not already enabled)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 2. Policy for SELECT: Allow users to read their own preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT 
  TO authenticated
  USING (auth.uid()::text = user_id);

-- 3. Policy for INSERT: Allow users to create their own preferences
CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- 4. Policy for UPDATE: Allow users to update their own preferences
CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE 
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- 5. Policy for DELETE: Allow users to delete their own preferences
CREATE POLICY "Users can delete their own preferences" ON user_preferences
  FOR DELETE 
  TO authenticated
  USING (auth.uid()::text = user_id);

-- 6. OPTIONAL: If you want to allow anonymous users to read some public data
-- (uncomment if needed, but typically not recommended for user preferences)
-- CREATE POLICY "Allow anonymous read access" ON user_preferences
--   FOR SELECT 
--   TO anon
--   USING (true);

-- 7. Grant necessary permissions to authenticated role
GRANT ALL ON user_preferences TO authenticated;
GRANT USAGE ON SEQUENCE user_preferences_id_seq TO authenticated; 