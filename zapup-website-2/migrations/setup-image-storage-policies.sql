-- Setup storage policies for student-question-images bucket
-- This allows authenticated users to upload, view, and delete their own images

-- Enable RLS on uploaded_question_images table (if not already enabled)
ALTER TABLE uploaded_question_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own images" ON uploaded_question_images;
DROP POLICY IF EXISTS "Users can view their own images" ON uploaded_question_images;
DROP POLICY IF EXISTS "Users can delete their own images" ON uploaded_question_images;
DROP POLICY IF EXISTS "Users can update their own images" ON uploaded_question_images;

-- Table policies: Allow users to manage their own image records
CREATE POLICY "Users can upload their own images"
ON uploaded_question_images
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own images"
ON uploaded_question_images
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own images"
ON uploaded_question_images
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own images"
ON uploaded_question_images
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id);

-- Storage bucket policies
-- Note: These need to be created in Supabase Dashboard -> Storage -> student-question-images -> Policies

-- Policy 1: Allow authenticated users to upload images to their own folder
-- Name: "Users can upload to own folder"
-- Operation: INSERT
-- Policy: bucket_id = 'student-question-images' AND (storage.foldername(name))[1] = auth.uid()::text

-- Policy 2: Allow authenticated users to view their own images
-- Name: "Users can view own images"
-- Operation: SELECT
-- Policy: bucket_id = 'student-question-images' AND (storage.foldername(name))[1] = auth.uid()::text

-- Policy 3: Allow authenticated users to delete their own images
-- Name: "Users can delete own images"
-- Operation: DELETE
-- Policy: bucket_id = 'student-question-images' AND (storage.foldername(name))[1] = auth.uid()::text

-- Policy 4: Make bucket public (optional - only if you want public URLs to work)
-- Name: "Public access to all images"
-- Operation: SELECT
-- Policy: bucket_id = 'student-question-images'
