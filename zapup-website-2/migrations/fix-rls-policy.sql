-- Fix RLS policy for uploaded_question_images
-- This addresses the UUID vs TEXT type mismatch issue

-- Drop the incorrectly created policy
DROP POLICY IF EXISTS "Users can view community images" ON uploaded_question_images;

-- Recreate with proper type casting
-- user_id is TEXT, auth.uid() returns UUID, so we cast to text
CREATE POLICY "Users can view community images"
ON uploaded_question_images FOR SELECT
USING (
  is_community = true
  OR user_id = auth.uid()::text
);

-- Verify the policy was created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'uploaded_question_images';
