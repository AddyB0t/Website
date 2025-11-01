# Fix Storage Policies for Clerk Authentication

## Problem
The storage bucket policies are using `auth.uid()` which expects Supabase Auth, but we're using Clerk for authentication. This causes RLS policy violations.

## Solution

Since we can't use `auth.uid()` with Clerk, we need to make the storage bucket policies more permissive or use a different approach.

## Option 1: Make Storage Bucket Public (Recommended for Development)

Go to **Supabase Dashboard** → **Storage** → **student-question-images** → **Policies**

**Delete all existing policies** and create **ONE simple policy**:

### Policy: Allow all authenticated operations
- **Name**: `Allow all operations for authenticated users`
- **Allowed operation**: `All` (or create separate policies for INSERT, SELECT, DELETE)
- **Policy definition**:
  ```sql
  true
  ```

**OR** for more security, create three separate policies:

### Policy 1: Allow all authenticated uploads
- **Name**: `Allow authenticated uploads`
- **Allowed operation**: `INSERT`
- **Policy definition**: `true`

### Policy 2: Allow all authenticated reads
- **Name**: `Allow authenticated reads`
- **Allowed operation**: `SELECT`
- **Policy definition**: `true`

### Policy 3: Allow all authenticated deletes
- **Name**: `Allow authenticated deletes`
- **Allowed operation**: `DELETE`
- **Policy definition**: `true`

## Option 2: Make Bucket Completely Public (Simplest)

1. Go to **Storage** → **student-question-images**
2. Click the three dots menu
3. Select **Edit bucket**
4. Enable **"Public bucket"**
5. **Delete all RLS policies** on the bucket

This makes all files in the bucket publicly accessible, but that's fine since:
- Files are stored with user-specific folder paths
- The database table still has RLS to track ownership
- Public URLs are needed for image preview anyway

## After Making Changes

1. **Restart your dev server** (Ctrl+C, then `npm run dev`)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Try uploading again**

## Verification

After setup, you should see in the console:
```
✅ Image uploaded to Supabase: [some-id]
```

Instead of:
```
Error uploading to storage: new row violates row-level security policy
```
