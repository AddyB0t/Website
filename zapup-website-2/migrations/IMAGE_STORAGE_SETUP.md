# Image Storage Setup Guide

## Issue
Images are failing to upload because of missing storage bucket policies.

## Solution

### Step 1: Run the SQL migration
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `setup-image-storage-policies.sql`
3. Click "Run" to execute the SQL

This will set up the table-level RLS policies.

### Step 2: Set up Storage Bucket Policies

Since storage bucket policies can't be created via SQL, you need to create them manually:

1. Go to **Supabase Dashboard** → **Storage** → **student-question-images** bucket
2. Click on **Policies** tab
3. Create the following policies:

#### Policy 1: Allow users to upload to their own folder
- **Name**: `Users can upload to own folder`
- **Allowed operation**: `INSERT`
- **Policy definition**:
  ```sql
  bucket_id = 'student-question-images' AND (storage.foldername(name))[1] = auth.uid()::text
  ```

#### Policy 2: Allow users to view their own images
- **Name**: `Users can view own images`
- **Allowed operation**: `SELECT`
- **Policy definition**:
  ```sql
  bucket_id = 'student-question-images' AND (storage.foldername(name))[1] = auth.uid()::text
  ```

#### Policy 3: Allow users to delete their own images
- **Name**: `Users can delete own images`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  bucket_id = 'student-question-images' AND (storage.foldername(name))[1] = auth.uid()::text
  ```

#### Policy 4: Public read access (REQUIRED for public URLs)
- **Name**: `Public access to all images`
- **Allowed operation**: `SELECT`
- **Policy definition**:
  ```sql
  bucket_id = 'student-question-images'
  ```
  **Note**: This allows anyone with the URL to view images. This is needed for the image preview and analysis features to work.

### Step 3: Verify Bucket Settings

Make sure the bucket is set to **Public**:
1. Go to **Storage** → **student-question-images**
2. Click on the bucket settings (three dots menu)
3. Ensure "Public bucket" is **enabled**

### Step 4: Test the upload

After setting up the policies:
1. Restart your Next.js dev server (to clear any cached errors)
2. Try uploading an image again
3. Check the browser console for detailed error messages if it still fails

## Troubleshooting

If uploads still fail:
1. Check browser console for detailed error messages
2. Verify that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
3. Verify that Clerk authentication is working (user is logged in)
4. Check Supabase logs in Dashboard → Logs → API for any errors
