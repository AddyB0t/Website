import { Pool } from 'pg';

// Database configuration using your environment variables
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Client',
  port: 5432,
});

export type UserPreferences = {
  id: number;
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  school_board?: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge' | 'Other';
  class_level?: '6' | '7' | '8' | '9' | '10' | '11' | '12';
  stream?: 'Science' | 'Commerce' | 'Arts';
  profile_picture_url?: string;
  profile_picture_filename?: string;
  profile_picture_size?: number;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
};

export const userPreferencesService = {
  // Get user preferences by user_id
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT * FROM user_preferences WHERE user_id = $1',
        [userId]
      );
      client.release();

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  },

  // Create or update user preferences
  async upsertUserPreferences(preferences: Partial<UserPreferences> & { user_id: string }): Promise<UserPreferences | null> {
    try {
      const client = await pool.connect();
      
      // First, try to update existing record
      const updateResult = await client.query(`
        UPDATE user_preferences 
        SET 
          email = COALESCE($2, email),
          first_name = COALESCE($3, first_name),
          last_name = COALESCE($4, last_name),
          school_board = COALESCE($5, school_board),
          class_level = COALESCE($6, class_level),
          stream = COALESCE($7, stream),
          profile_picture_url = COALESCE($8, profile_picture_url),
          profile_picture_filename = COALESCE($9, profile_picture_filename),
          profile_picture_size = COALESCE($10, profile_picture_size),
          profile_complete = COALESCE($11, profile_complete),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
        RETURNING *
      `, [
        preferences.user_id,
        preferences.email,
        preferences.first_name,
        preferences.last_name,
        preferences.school_board,
        preferences.class_level,
        preferences.stream,
        preferences.profile_picture_url,
        preferences.profile_picture_filename,
        preferences.profile_picture_size,
        preferences.profile_complete
      ]);

      if (updateResult.rows.length > 0) {
        client.release();
        return updateResult.rows[0];
      }

      // If no rows were updated, insert new record
      const insertResult = await client.query(`
        INSERT INTO user_preferences (
          user_id, email, first_name, last_name, school_board, 
          class_level, stream, profile_picture_url, profile_picture_filename, 
          profile_picture_size, profile_complete
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        preferences.user_id,
        preferences.email,
        preferences.first_name,
        preferences.last_name,
        preferences.school_board,
        preferences.class_level,
        preferences.stream,
        preferences.profile_picture_url,
        preferences.profile_picture_filename,
        preferences.profile_picture_size,
        preferences.profile_complete || false
      ]);

      client.release();
      return insertResult.rows[0];
    } catch (error) {
      console.error('Error upserting user preferences:', error);
      return null;
    }
  },

  // Update profile picture
  async updateProfilePicture(userId: string, profileData: {
    profile_picture_url: string;
    profile_picture_filename: string;
    profile_picture_size: number;
  }): Promise<UserPreferences | null> {
    try {
      const client = await pool.connect();
      const result = await client.query(`
        UPDATE user_preferences 
        SET 
          profile_picture_url = $2,
          profile_picture_filename = $3,
          profile_picture_size = $4,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
        RETURNING *
      `, [
        userId,
        profileData.profile_picture_url,
        profileData.profile_picture_filename,
        profileData.profile_picture_size
      ]);
      client.release();

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return null;
    }
  },

  // Delete profile picture (set to null)
  async deleteProfilePicture(userId: string): Promise<boolean> {
    try {
      const client = await pool.connect();
      await client.query(`
        UPDATE user_preferences 
        SET 
          profile_picture_url = NULL,
          profile_picture_filename = NULL,
          profile_picture_size = NULL,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
      `, [userId]);
      client.release();
      return true;
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      return false;
    }
  },

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }
}; 