# Sync Question Availability Table

The `question_availability` table should reflect the actual count of questions in the database. Here's how to sync it:

## Option 1: Run SQL Query Directly

Run this SQL in your Supabase dashboard:

```sql
-- Clear old data
DELETE FROM question_availability;

-- Insert accurate counts from actual questions table
INSERT INTO question_availability (class_id, subject, chapter, section, question_count, is_available, last_updated)
SELECT
  class_id,
  subject,
  chapter,
  COALESCE(section, 'General') as section,
  COUNT(*) as question_count,
  true as is_available,
  NOW() as last_updated
FROM questions
WHERE is_active = true
GROUP BY class_id, subject, chapter, COALESCE(section, 'General')
HAVING COUNT(*) > 0;

-- Verify the results
SELECT
  class_id,
  subject,
  COUNT(DISTINCT chapter) as chapter_count,
  SUM(question_count) as total_questions
FROM question_availability
GROUP BY class_id, subject
ORDER BY class_id, subject;
```

## Option 2: Use the Sync API Endpoint

Make a POST request to the sync endpoint:

```bash
curl -X POST http://localhost:3000/api/questions/sync-availability
```

Or visit this URL in your browser when logged in as admin:
```
http://localhost:3000/api/questions/sync-availability
```

## Expected Result for Class 10 Mathematics

After syncing, Class 10 Mathematics should show:
- **14 chapters** (not 22)
- **~1000 questions** total

The 14 chapters are:
1. Shares and Dividends
2. Linear Inequations
3. Quadratic Equations in One Variable
4. Circles
5. Arithmetic Progressions
6. Goods and Services tax (GST)
7. Banking
8. Factorisation
9. Matrices
10. Geometric Progression
11. Reflection
12. Section Formula
13. Equation of a Straight Line
14. Similarity

## When to Run This Sync

Run this sync whenever you:
- Import new questions into the database
- Delete or modify existing questions
- Notice that the chapter count on the frontend doesn't match reality
- After bulk data migrations or updates

## Automation (Future)

Consider setting up a PostgreSQL trigger to automatically update `question_availability` when questions are inserted, updated, or deleted.
