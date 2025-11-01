import { createClient } from '@supabase/supabase-js';

// Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug logging to understand the issue
console.log('🔍 Supabase Configuration Debug:');
console.log('- URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
console.log('- Key:', supabaseAnonKey ? 'SET' : 'NOT SET');
console.log('- Environment:', typeof window !== 'undefined' ? 'Browser' : 'Server');

// Check if Supabase credentials are provided
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
  console.log('📦 Will use localStorage fallback for all operations');
} else {
  console.log('✅ Supabase credentials found - attempting to connect...');
}

// Create a single supabase client for the entire app
// Use dummy values if credentials are missing to prevent build errors
export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co',
  supabaseAnonKey || 'dummy-key'
);


export type UserPreferences = {
  id: number;
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  school_type?: string; // Fixed: Changed from school_board to school_type to match database schema
  class_level?: '6' | '7' | '8' | '9' | '10' | '11' | '12';
  stream?: string; // Fixed: Changed from union type to string to match database schema
  state?: string;
  school?: string;
  profile_picture_url?: string;
  profile_picture_filename?: string;
  profile_picture_size?: number;
  profile_complete: boolean;
  subscription_type?: string; // Added: Missing field from database schema
  created_at: string;
  updated_at: string;
};

// Fallback storage functions
const fallbackStorage = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
    return null;
  },
  
  set: (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
      }
    }
    return false;
  }
};

// Database functions for user preferences
export const userPreferencesService = {
  // Get user preferences by user_id
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    console.log(`🔍 getUserPreferences called for userId: ${userId}`);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('❌ Supabase not configured. Using localStorage fallback.');
      const fallbackData = fallbackStorage.get(`user_preferences_${userId}`);
      console.log('📦 Retrieved from localStorage:', fallbackData ? 'Data found' : 'No data');
      return fallbackData;
    }

    console.log('✅ Attempting Supabase query...');
    try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
        console.error('❌ Supabase query error:', error.message);
        console.log('📦 Falling back to localStorage...');
        const fallbackData = fallbackStorage.get(`user_preferences_${userId}`);
        console.log('📦 Retrieved from localStorage fallback:', fallbackData ? 'Data found' : 'No data');
        return fallbackData;
    }

      console.log('✅ Supabase query successful!');
    return data;
    } catch (networkError) {
      console.error('❌ Network error connecting to Supabase:', networkError);
      console.log('📦 Falling back to localStorage...');
      const fallbackData = fallbackStorage.get(`user_preferences_${userId}`);
      console.log('📦 Retrieved from localStorage fallback:', fallbackData ? 'Data found' : 'No data');
      return fallbackData;
    }
  },

  // Create or update user preferences
  async upsertUserPreferences(preferences: Partial<UserPreferences> & { user_id: string }): Promise<UserPreferences | null> {
    console.log('🔍 upsertUserPreferences called with:', preferences);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('❌ Supabase not configured. Using localStorage fallback.');
      const existing = fallbackStorage.get(`user_preferences_${preferences.user_id}`);
      const updated = {
        id: existing?.id || Date.now(),
        ...existing,
        ...preferences,
        updated_at: new Date().toISOString(),
        created_at: existing?.created_at || new Date().toISOString()
      };
      fallbackStorage.set(`user_preferences_${preferences.user_id}`, updated);
      console.log('📦 Saved to localStorage:', updated);
      return updated;
    }

    console.log('✅ Supabase configured. Attempting database upsert...');
    try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert(preferences, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
        console.error('❌ Supabase upsert error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        console.log('📦 Falling back to localStorage...');
        const existing = fallbackStorage.get(`user_preferences_${preferences.user_id}`);
        const updated = {
          id: existing?.id || Date.now(),
          ...existing,
          ...preferences,
          updated_at: new Date().toISOString(),
          created_at: existing?.created_at || new Date().toISOString()
        };
        fallbackStorage.set(`user_preferences_${preferences.user_id}`, updated);
        console.log('📦 Fallback saved to localStorage:', updated);
        return updated;
    }

    console.log('✅ Database upsert successful!', data);
    return data;
    } catch (networkError) {
      console.error('Network error connecting to Supabase:', networkError);
              console.log('Falling back to localStorage...');
        const existing = fallbackStorage.get(`user_preferences_${preferences.user_id}`);
        const updated = {
          id: existing?.id || Date.now(),
          ...existing,
          ...preferences,
          updated_at: new Date().toISOString(),
          created_at: existing?.created_at || new Date().toISOString()
        };
        fallbackStorage.set(`user_preferences_${preferences.user_id}`, updated);
      return updated;
    }
  },

  // Update profile picture
  async updateProfilePicture(userId: string, profileData: {
    profile_picture_url: string;
    profile_picture_filename: string;
    profile_picture_size: number;
  }): Promise<UserPreferences | null> {
    return this.upsertUserPreferences({
      user_id: userId,
      ...profileData
    });
  },

  // Upload profile picture to Supabase Storage
  async uploadProfilePicture(userId: string, file: File): Promise<string | null> {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Supabase not configured. Converting to base64 for localStorage...');
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
        return base64String;
      } catch (error) {
        console.error('Error converting file to base64:', error);
        return null;
      }
    }

    try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading to Supabase Storage:', uploadError);
        console.log('Falling back to base64...');
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
        return base64String;
    }

    const { data } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);

    return data.publicUrl;
    } catch (error) {
      console.error('Network error uploading to Supabase:', error);
      console.log('Falling back to base64...');
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
        return base64String;
      } catch (base64Error) {
        console.error('Error converting file to base64:', base64Error);
        return null;
      }
    }
  },

  // Delete profile picture (simplified version without file path)
  async deleteProfilePicture(userId: string): Promise<boolean> {
    try {
      const result = await this.upsertUserPreferences({
        user_id: userId,
        profile_picture_url: undefined,
        profile_picture_filename: undefined,
        profile_picture_size: undefined
      });
      return !!result;
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      return false;
    }
  },

  // Test database connection
  async testConnection(): Promise<boolean> {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Supabase not configured. Using localStorage fallback - connection test passed');
      return true;
    }

    try {
      const { error } = await supabase
      .from('user_preferences')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Database connection failed:', error);
        console.log('Will use localStorage fallback');
        return true; // Return true so app continues to work with fallback
      }

      console.log('Database connection successful');
    return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      console.log('Will use localStorage fallback');
      return true; // Return true so app continues to work with fallback
    }
  }
};

// Image upload types
export type UploadedImage = {
  id: string;
  user_id: string;
  image_url: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  analyzed: boolean;
  analysis_text?: string;
  class_level?: string;
  subject?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
};

// Image storage service for student question images
export const imageStorageService = {
  // Upload image to Supabase Storage
  async uploadQuestionImage(
    userId: string,
    file: File,
    metadata?: {
      analyzed?: boolean;
      analysis_text?: string;
      class_level?: string;
      subject?: string;
      tags?: string[];
    }
  ): Promise<{ success: boolean; data?: UploadedImage; error?: string }> {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storagePath = `${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('student-question-images')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading to storage:', uploadError);
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('student-question-images')
        .getPublicUrl(storagePath);

      // Save metadata to database
      const imageData = {
        user_id: userId,
        image_url: urlData.publicUrl,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        analyzed: metadata?.analyzed || false,
        analysis_text: metadata?.analysis_text,
        class_level: metadata?.class_level,
        subject: metadata?.subject,
        tags: metadata?.tags || []
      };

      const { data, error: dbError } = await supabase
        .from('uploaded_question_images')
        .insert(imageData)
        .select()
        .single();

      if (dbError) {
        console.error('Error saving to database:', dbError);
        // Try to delete uploaded file if database insert fails
        await supabase.storage
          .from('student-question-images')
          .remove([storagePath]);
        return { success: false, error: dbError.message };
      }

      return { success: true, data: data as UploadedImage };
    } catch (error) {
      console.error('Unexpected error uploading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get all images for a user
  async getUserImages(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ success: boolean; data?: UploadedImage[]; count?: number; error?: string }> {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error, count } = await supabase
        .from('uploaded_question_images')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching images:', error);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: data as UploadedImage[],
        count: count || 0
      };
    } catch (error) {
      console.error('Unexpected error fetching images:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Delete an image
  async deleteImage(
    userId: string,
    imageId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      // First, get the image data to find storage path
      const { data: imageData, error: fetchError } = await supabase
        .from('uploaded_question_images')
        .select('storage_path')
        .eq('id', imageId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !imageData) {
        console.error('Error fetching image data:', fetchError);
        return { success: false, error: 'Image not found' };
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('student-question-images')
        .remove([imageData.storage_path]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue even if storage delete fails - clean up database
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_question_images')
        .delete()
        .eq('id', imageId)
        .eq('user_id', userId);

      if (dbError) {
        console.error('Error deleting from database:', dbError);
        return { success: false, error: dbError.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected error deleting image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Update image metadata
  async updateImageMetadata(
    userId: string,
    imageId: string,
    metadata: {
      analyzed?: boolean;
      analysis_text?: string;
      class_level?: string;
      subject?: string;
      tags?: string[];
    }
  ): Promise<{ success: boolean; data?: UploadedImage; error?: string }> {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase
        .from('uploaded_question_images')
        .update(metadata)
        .eq('id', imageId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating image metadata:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data as UploadedImage };
    } catch (error) {
      console.error('Unexpected error updating metadata:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}; 