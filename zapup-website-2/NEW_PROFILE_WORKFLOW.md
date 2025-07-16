# New Profile Workflow: State → City → Board Type → School

## Overview

The profile creation workflow has been enhanced to provide a more structured and comprehensive selection process. Instead of the previous State → School workflow, users now follow a 4-step process:

1. **State** - Select your state/territory
2. **City** - Select your city from the chosen state  
3. **Board Type** - Select educational board (CBSE, ICSE, IB, Cambridge, State Board)
4. **School** - Select your school from the filtered list

## Implementation Details

### Database Schema Changes

New columns added to `user_preferences` table:
- `city` (VARCHAR(100)) - City selection from chosen state
- `board_type` (VARCHAR(50)) - Educational board type selection

### Updated Profile Completion Logic

A user's profile is now considered complete when ALL of the following are selected:
- Current Class
- State  
- City
- Board Type
- School
- Stream (only required for classes 11 and 12)

### Enhanced Schools Database

Created comprehensive database with:
- **5 states** initially covered (Delhi, Maharashtra, Karnataka, Tamil Nadu, Haryana)
- **7 major cities** (Delhi, Mumbai, Pune, Bangalore, Chennai, Gurgaon)
- **5 board types** (CBSE, ICSE, IB, Cambridge, State Board)
- **300+ schools** with good coverage across all board types

#### Coverage by State:

**Delhi:**
- Cities: Delhi
- Board Types: CBSE (10), ICSE (10), IB (10), Cambridge (10)
- Total: 40 schools

**Maharashtra:**
- Cities: Mumbai (40), Pune (40) 
- Board Types: CBSE, ICSE, IB, Cambridge (10 each per city)
- Total: 80 schools

**Karnataka:**
- Cities: Bangalore
- Board Types: CBSE (10), ICSE (10), IB (10), Cambridge (10)
- Total: 40 schools

**Tamil Nadu:**
- Cities: Chennai
- Board Types: CBSE (10), ICSE (10), IB (10), Cambridge (10)
- Total: 40 schools

**Haryana:**
- Cities: Gurgaon
- Board Types: CBSE (10), ICSE (10), IB (10), Cambridge (10)
- Total: 40 schools

### File Structure

```
lib/
├── enhanced-states-schools-data.ts    # New comprehensive schools database
├── states-schools-data.ts             # Original (kept for backward compatibility)
├── client-database.ts                 # Updated with new types
└── supabase.ts                        # Updated with new types

contexts/
└── UserPreferencesContext.tsx         # Updated for new workflow

app/profile/
└── page.tsx                          # Updated UI for 4-step workflow

migrations/
├── add-city-board-type-columns.sql   # Database migration script
└── user-preferences-schema.sql       # Updated schema
```

### UI/UX Improvements

The profile page now features:
- **Sequential workflow** - Each step only appears after the previous is completed
- **Dynamic filtering** - Options are filtered based on previous selections
- **Better organization** - 4-column grid for main workflow, separate row for class/stream
- **Improved validation** - All 4 location fields required for form submission

### API Integration

The enhanced workflow is fully backward compatible:
- Existing API routes work without changes
- New fields automatically handled by existing endpoints
- Database types updated to include new fields

## Migration Guide

### For Existing Users

1. Run the database migration:
   ```sql
   -- Add new columns
   ALTER TABLE user_preferences 
   ADD COLUMN IF NOT EXISTS city VARCHAR(100);
   
   ALTER TABLE user_preferences 
   ADD COLUMN IF NOT EXISTS board_type VARCHAR(50) 
   CHECK (board_type IN ('CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'));
   ```

2. Existing users will be prompted to complete their profiles with the new fields

### For New Installations

1. Use the updated `user-preferences-schema.sql` which includes all fields
2. Import the enhanced schools database
3. Deploy the updated frontend code

## Usage Examples

### Frontend Usage

```typescript
import { 
  getStateNames, 
  getCitiesByState, 
  getBoardsByStateAndCity, 
  getSchoolsByStateAndCityAndBoard 
} from '@/lib/enhanced-states-schools-data';

// Step 1: Get all states
const states = getStateNames();

// Step 2: Get cities for selected state
const cities = getCitiesByState('Maharashtra');

// Step 3: Get board types for selected state and city
const boards = getBoardsByStateAndCity('Maharashtra', 'Mumbai');

// Step 4: Get schools for selected state, city, and board
const schools = getSchoolsByStateAndCityAndBoard('Maharashtra', 'Mumbai', 'CBSE');
```

### Context Usage

```typescript
const { updatePreferences } = useUserPreferences();

await updatePreferences({
  state: 'Maharashtra',
  city: 'Mumbai', 
  boardType: 'CBSE',
  school: 'Dhirubhai Ambani International School',
  currentClass: '10'
});
```

## Benefits

1. **Better Data Quality** - More structured and specific school selection
2. **Improved User Experience** - Clear step-by-step process
3. **Enhanced Filtering** - Users only see relevant options
4. **Scalability** - Easy to add more states, cities, and schools
5. **Analytics** - Better insights into user distribution by location and board type
6. **Personalization** - More targeted content based on specific board types and locations

## Future Enhancements

1. **State Board Coverage** - Add specific state board schools for each state
2. **Rural Areas** - Expand to include schools in smaller cities and towns  
3. **School Ratings** - Integrate school ranking and rating information
4. **Distance Calculation** - Show schools near user's location
5. **School Details** - Add more information like fees, facilities, etc.
6. **Automated Updates** - Script to periodically update school information

## Testing

Run the test workflow:
```bash
node test-workflow.js
```

This will verify:
- All states have adequate city coverage
- All cities have multiple board types
- All board-city combinations have sufficient schools
- Workflow functions correctly for sample selections

## Support

For issues or questions about the new workflow:
1. Check the test workflow results
2. Verify database migration completed successfully
3. Ensure all new files are properly imported
4. Check browser console for any TypeScript errors 