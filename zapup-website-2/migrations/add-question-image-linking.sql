-- Migration: Add question image linking support
-- Purpose: Allow images to be linked to specific questions with hybrid user/community model
-- Date: 2025-01-XX

-- Step 1: Add new columns to uploaded_question_images table
ALTER TABLE uploaded_question_images
ADD COLUMN IF NOT EXISTS question_id INTEGER REFERENCES questions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_community BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS linked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Step 2: Add index for performance on question_id lookups
CREATE INDEX IF NOT EXISTS idx_uploaded_question_images_question_id
ON uploaded_question_images(question_id);

-- Step 3: Add composite index for user + question lookups (most common query)
CREATE INDEX IF NOT EXISTS idx_user_question_images
ON uploaded_question_images(user_id, question_id)
WHERE question_id IS NOT NULL;

-- Step 4: Add index for community images
CREATE INDEX IF NOT EXISTS idx_community_question_images
ON uploaded_question_images(question_id, is_community)
WHERE is_community = true;

-- Step 5: Update RLS policies to allow viewing community images
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view community images" ON uploaded_question_images;

-- Create new policy for community images
-- Note: user_id is stored as TEXT, so we cast auth.uid() to text for comparison
CREATE POLICY "Users can view community images"
ON uploaded_question_images FOR SELECT
USING (
  is_community = true
  OR user_id = auth.uid()::text
);

-- Step 6: Add comment for documentation
COMMENT ON COLUMN uploaded_question_images.question_id IS 'Links image to a specific question. NULL means image is not linked.';
COMMENT ON COLUMN uploaded_question_images.is_community IS 'If true, this image is shared with all users for this question.';
COMMENT ON COLUMN uploaded_question_images.linked_at IS 'Timestamp when image was linked to the question.';

-- Step 7: Add constraint to ensure only one community image per question
-- This uses a partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_community_image_per_question
ON uploaded_question_images(question_id)
WHERE is_community = true;

-- Migration complete
