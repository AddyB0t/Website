# State and School Selection Feature

This feature adds state and school selection to the user profile, allowing users to specify their location and school from a curated list of top schools in each Indian state.

## Features Added

### 1. State Selection
- Dropdown with all 28 Indian states and 8 Union Territories
- Required field for profile completion
- Automatically resets school selection when state changes

### 2. School Selection
- Dynamic dropdown populated with top 10 schools for the selected state
- Schools include name, city, and board information
- Only appears after a state is selected
- Required field for profile completion

### 3. Database Schema Updates
- Added `state` column (VARCHAR(100)) to user_preferences table
- Added `school` column (VARCHAR(255)) to user_preferences table
- Added indexes for better query performance
- Updated profile completion logic to require state and school

## Implementation Details

### Database Changes
```sql
-- Add state column
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- Add school column  
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS school VARCHAR(255);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_state ON user_preferences(state);
CREATE INDEX IF NOT EXISTS idx_user_preferences_school ON user_preferences(school);
```

### Files Modified
1. **`lib/states-schools-data.ts`** - New file containing comprehensive data for all Indian states and their top schools
2. **`contexts/UserPreferencesContext.tsx`** - Updated to handle state and school preferences
3. **`app/profile/page.tsx`** - Added UI components for state and school selection
4. **`lib/client-database.ts`** - Updated TypeScript types
5. **`lib/database-postgres-backup.ts`** - Updated database operations
6. **`lib/supabase.ts`** - Updated TypeScript types
7. **`app/api/user-preferences/route.ts`** - Updated API to handle new fields

### School Data Structure
Each state contains an array of schools with:
- `name`: School name
- `city`: City where school is located
- `board`: Educational board (CBSE, ICSE, IB, Cambridge, State Board)

Example:
```typescript
{
  name: "Delhi",
  schools: [
    { name: "Delhi Public School, R.K. Puram", city: "Delhi", board: "CBSE" },
    { name: "Modern School", city: "Delhi", board: "CBSE" },
    // ... more schools
  ]
}
```

## Usage

### For Users
1. Navigate to Profile page
2. Select your state from the dropdown
3. Select your school from the populated list
4. Save preferences

### For Developers
```typescript
import { getStateNames, getSchoolsByState } from '@/lib/states-schools-data';

// Get all state names
const states = getStateNames();

// Get schools for a specific state
const schools = getSchoolsByState('Delhi');
```

## Migration

For existing databases, run the migration script:
```bash
psql -h localhost -U postgres -d Client -f migrations/add-state-school-columns.sql
```

## Profile Completion Logic

A user's profile is now considered complete when:
- School Board is selected
- Current Class is selected
- State is selected
- School is selected
- Stream is selected (only for classes 11 and 12)

## Data Coverage

The feature includes:
- All 28 Indian states
- All 8 Union Territories
- Top 10 schools per state/territory
- Mix of different educational boards (CBSE, ICSE, IB, Cambridge, State Board)
- Major cities covered in each state

## Future Enhancements

Potential improvements:
1. Add more schools per state
2. Include school rankings or ratings
3. Add school type filters (Government, Private, International)
4. Include school contact information
5. Add school logos/images
6. Implement school search functionality 