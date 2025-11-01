# Scripts Documentation

This directory contains scripts for managing question data upload and maintenance.

## Production Scripts

### Data Upload Scripts

#### `upload_class12_data.js`
Uploads all Class 12 subjects from CSV files to the database.

**Usage:**
```bash
node scripts/upload_class12_data.js
```

**What it does:**
- Uploads 8 Class 12 subjects: Physics, Chemistry, Accountancy, Business Studies, Economics, Commerce, Computer Science, Environmental Studies
- Creates subjects, books, chapters, exercises, and questions
- Handles duplicate chapter prevention
- Provides progress reporting

**Expected Output:** ~17,611 questions across 114 chapters

---

#### `upload_physics.js`
Uploads Class 9 Physics data specifically.

**Usage:**
```bash
node scripts/upload_physics.js
```

**What it does:**
- Uploads Class 9 Physics from `/mnt/data/Pasia/Website/class 9th/9-Physics/organized_physics_questions.csv`
- Creates 10 chapters, 115 exercises, 1,099 questions

---

#### `reupload_class9_data.js`
Re-uploads all Class 9 subjects (use with caution - meant for data fixes).

**Usage:**
```bash
node scripts/reupload_class9_data.js
```

**What it does:**
- Uploads 10 Class 9 subjects from CSV files
- Creates proper chapter/exercise structure
- Handles null question filtering

---

### Maintenance Scripts

#### `update_chapter_question_counts.js`
Updates the `total_questions` and `total_exercises` fields for Class 9 chapters.

**Usage:**
```bash
node scripts/update_chapter_question_counts.js
```

**When to run:**
- After uploading new Class 9 data
- After modifying Class 9 questions
- If chapter counts appear incorrect in the frontend

---

#### `update_class12_chapter_counts.js`
Updates the `total_questions` and `total_exercises` fields for Class 12 chapters.

**Usage:**
```bash
node scripts/update_class12_chapter_counts.js
```

**When to run:**
- After uploading new Class 12 data
- After modifying Class 12 questions
- If chapter counts appear incorrect in the frontend

---

### Utility Scripts

#### `delete_class9.js`
**⚠️ DANGER: Deletes all Class 9 data from the database**

**Usage:**
```bash
node scripts/delete_class9.js
```

**What it does:**
- Deletes all questions, exercises, chapters, and books for Class 9
- Respects foreign key constraints by deleting in correct order

**When to use:**
- Only when you need to completely re-upload Class 9 data
- Requires confirmation before running

---

## Development/Testing Scripts

### `check_chapter_questions.js`
Checks question counts for specific chapters.

### `check_class11_school_type.js`
Verifies school_type values for Class 11 books.

### `check_class9_data.js`
Analyzes Class 9 data structure.

### `check_exercise_names.js`
Validates exercise naming conventions.

### `check_exercises_schema.js`
Verifies exercises table schema.

###`debug_class11_api.js`
Tests Class 11 API endpoints.

### `test_available_subjects_api.js`
Tests the available subjects API endpoint.

### `test_class11_api_direct.js`
Direct API testing for Class 11.

---

## Common Workflows

### Initial Setup: Upload All Data

```bash
# 1. Upload Class 9 data (if not already done)
node scripts/reupload_class9_data.js

# 2. Upload Class 9 Physics
node scripts/upload_physics.js

# 3. Upload Class 12 data
node scripts/upload_class12_data.js

# 4. Update chapter counts for Class 9
node scripts/update_chapter_question_counts.js

# 5. Update chapter counts for Class 12
node scripts/update_class12_chapter_counts.js
```

### Re-upload Class 9 Data (After Data Issues)

```bash
# 1. Delete existing Class 9 data
node scripts/delete_class9.js

# 2. Re-upload Class 9 data
node scripts/reupload_class9_data.js

# 3. Update chapter counts
node scripts/update_chapter_question_counts.js
```

### Update Chapter Counts Only

```bash
# For Class 9
node scripts/update_chapter_question_counts.js

# For Class 12
node scripts/update_class12_chapter_counts.js
```

---

## Environment Requirements

All scripts require:
- Node.js v20+
- `.env.local` file with:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Supabase database with proper schema
- CSV files in `/mnt/data/Pasia/Website/` directories

---

## Error Handling

### Common Errors and Solutions

**Error: "duplicate key value violates unique constraint"**
- Cause: Trying to insert duplicate chapter numbers
- Solution: Check CSV for duplicate chapter_number values, or delete existing data first

**Error: "null value in column 'code' of relation 'subjects'"**
- Cause: Subject creation missing required `code` field
- Solution: Script should auto-generate code from subject name

**Error: "Cannot find module '@supabase/supabase-js'"**
- Cause: Dependencies not installed
- Solution: Run `npm install` in the project root

**Error: "invalid input syntax for type integer"**
- Cause: Trying to insert UUID where integer expected (usually exercise_id)
- Solution: Exercises use auto-increment IDs, not UUIDs

---

## Database Schema Reference

### Tables Used

- **subjects**: Subject definitions (code, name, category, class_levels)
- **books**: Books per class/subject (title, class_level, subject_id, school_type)
- **chapters**: Chapters within books (title, chapter_number, book_id, total_questions, total_exercises)
- **exercises**: Exercises within chapters (name, exercise_number, chapter_id, display_order)
- **questions**: Individual questions (text, exercise_id, class_id, subject, chapter, is_active, order_index)

### School Types

For ICSE classes (9, 10, 11, 12), use:
```
"ICSE (Indian Certificate of Secondary Education)"
```

---

## Production Deployment Checklist

- [ ] All environment variables set in production
- [ ] Database migrations completed
- [ ] CSV files uploaded to server
- [ ] Run upload scripts in order (Class 9 → Class 12)
- [ ] Update chapter counts for both classes
- [ ] Verify frontend shows "Available" for all subjects
- [ ] Test API endpoints
- [ ] Check question display in UI
- [ ] Monitor error logs

---

## Support

For issues or questions, check:
1. Script output for specific error messages
2. Supabase logs for database errors
3. CSV files for data quality issues
4. Frontend console for API errors
