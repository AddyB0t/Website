# Database Setup for User Preferences

This guide will help you set up the database integration for storing user preferences and profile pictures.

## Prerequisites

Make sure you have the following environment variables in your `.env.local` file:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_NAME=Client

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Step 1: Create the User Preferences Table

Run the SQL script to create the user preferences table:

```bash
# Connect to your PostgreSQL database and run:
psql -h localhost -U postgres -d Client -f user-preferences-schema.sql
```

Or copy and paste the contents of `user-preferences-schema.sql` into your database management tool.

## Step 2: Set Up Supabase Storage (if using Supabase)

If you're using Supabase, you need to create a storage bucket for profile pictures:

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a new bucket called `user-uploads`
4. Set it as public
5. Run the storage policies from the SQL file

Alternatively, run this SQL in your Supabase SQL editor:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', true);

-- Set up storage policies
CREATE POLICY "Users can upload their own files" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects 
FOR SELECT USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects 
FOR DELETE USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view profile pictures" ON storage.objects 
FOR SELECT USING (bucket_id = 'user-uploads');
```

## Step 3: Install Required Dependencies

Make sure you have the required packages installed:

```bash
npm install @supabase/supabase-js @clerk/nextjs
```

## Step 4: Update Your App Layout

The `UserPreferencesProvider` is already added to your app layout. Make sure it wraps your entire application.

## Features Implemented

### ✅ User Preferences Storage
- School board selection (CBSE, ICSE, State Board, IB, Cambridge, Other)
- Class level selection (6-12)
- Stream selection for classes 11-12 (Science, Commerce, Arts)
- Profile completion tracking

### ✅ Profile Picture Management
- Upload profile pictures (max 5MB, image files only)
- Store in Supabase storage with user-specific folders
- Delete existing profile pictures
- Fallback to Clerk profile pictures

### ✅ Database Integration
- Automatic user preference sync with database
- Row-level security for data protection
- Optimized queries with proper indexing
- Timestamp tracking for created/updated records

### ✅ UI Enhancements
- Loading states for all async operations
- Error handling and user feedback
- Profile picture upload/delete buttons
- Form validation and disabled states

## Database Schema

The `user_preferences` table includes:

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | VARCHAR(255) | Clerk user ID (unique) |
| email | VARCHAR(255) | User email |
| first_name | VARCHAR(100) | User first name |
| last_name | VARCHAR(100) | User last name |
| school_board | VARCHAR(50) | Selected school board |
| class_level | VARCHAR(20) | Selected class (6-12) |
| stream | VARCHAR(20) | Selected stream (for classes 11-12) |
| profile_picture_url | TEXT | URL to profile picture |
| profile_picture_filename | VARCHAR(255) | Original filename |
| profile_picture_size | INTEGER | File size in bytes |
| profile_complete | BOOLEAN | Whether profile is complete |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **File Upload Validation**: Only image files up to 5MB allowed
- **User-specific Storage**: Profile pictures stored in user-specific folders
- **Authentication Integration**: Seamless integration with Clerk authentication

## Testing

After setup, test the following:

1. **User Registration**: New users should have preferences created automatically
2. **Profile Completion**: Academic preferences should save to database
3. **Profile Pictures**: Upload and delete functionality should work
4. **Data Persistence**: Preferences should persist across sessions
5. **Security**: Users should only see their own data

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Check your environment variables
2. **Storage Upload Fails**: Verify Supabase storage bucket and policies
3. **RLS Policies**: Make sure you're authenticated with Clerk
4. **File Upload Size**: Check file size limits (5MB max)

### Debug Steps

1. Check browser console for errors
2. Verify database connection and table creation
3. Test Supabase storage bucket access
4. Confirm Clerk authentication is working

## Production Considerations

1. **Environment Variables**: Use secure environment variables in production
2. **File Storage**: Consider CDN for better performance
3. **Database Backups**: Set up regular database backups
4. **Monitoring**: Add logging for user actions and errors
5. **Rate Limiting**: Implement rate limiting for file uploads

## Next Steps

The system is now ready for:
- User onboarding with academic preferences
- Profile picture management
- Personalized content based on user selections
- Stream-specific subject navigation

All user data is securely stored in your PostgreSQL database with proper authentication and authorization. 