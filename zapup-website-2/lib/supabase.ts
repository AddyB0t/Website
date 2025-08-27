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