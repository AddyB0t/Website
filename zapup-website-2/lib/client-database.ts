// Client-side service for user preferences
// Makes API calls to server-side database operations

export type UserPreferences = {
  id: number;
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  school_board?: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge' | 'Other';
  class_level?: '6' | '7' | '8' | '9' | '10' | '11' | '12';
  stream?: 'Science' | 'Commerce' | 'Arts';
  state?: string;
  school?: string;
  profile_picture_url?: string;
  profile_picture_filename?: string;
  profile_picture_size?: number;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
};

export const userPreferencesService = {
  // Get user preferences
  async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const response = await fetch('/api/user-preferences', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('User not authenticated');
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  },

  // Create or update user preferences
  async upsertUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences | null> {
    try {
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error upserting user preferences:', error);
      return null;
    }
  },

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data.profile_picture_url : null;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }
  },

  // Delete profile picture
  async deleteProfilePicture(): Promise<boolean> {
    try {
      const response = await fetch('/api/profile-picture', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      return false;
    }
  },

  // Clear preferences
  async clearPreferences(): Promise<UserPreferences | null> {
    try {
      const response = await fetch('/api/user-preferences', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error clearing preferences:', error);
      return null;
    }
  }
}; 