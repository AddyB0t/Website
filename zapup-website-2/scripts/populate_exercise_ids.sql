-- ============================================================================
-- POPULATE EXERCISE_ID FOR ALL QUESTIONS
-- ============================================================================
-- This script links questions to exercises by matching:
-- 1. Questions are in chapters (via chapter_id or chapter name)
-- 2. Exercises belong to chapters
-- 3. Questions have a section field that matches exercise name
--
-- This will fix the issue where questions don't have exercise_id populated
-- ============================================================================

BEGIN;

-- Step 1: For questions that have chapter_id but no exercise_id,
-- match them to exercises based on chapter_id and section name
UPDATE questions q
SET
  exercise_id = e.id,
  updated_at = NOW()
FROM exercises e
WHERE
  q.chapter_id IS NOT NULL
  AND q.exercise_id IS NULL
  AND e.chapter_id = q.chapter_id
  AND (
    -- Try exact match first
    e.name = q.section
    OR
    -- Try case-insensitive match
    LOWER(e.name) = LOWER(q.section)
    OR
    -- Try matching "Exercise 1" to "Exercise 1"
    e.name ILIKE q.section
  );

-- Step 2: For questions that have chapter name but no chapter_id,
-- first populate their chapter_id by matching chapter names
UPDATE questions q
SET
  chapter_id = c.id,
  updated_at = NOW()
FROM chapters c
WHERE
  q.chapter_id IS NULL
  AND q.chapter IS NOT NULL
  AND (
    c.title = q.chapter
    OR LOWER(c.title) = LOWER(q.chapter)
  );

-- Step 3: Now populate exercise_id for questions that just got chapter_id
UPDATE questions q
SET
  exercise_id = e.id,
  updated_at = NOW()
FROM exercises e
WHERE
  q.chapter_id IS NOT NULL
  AND q.exercise_id IS NULL
  AND e.chapter_id = q.chapter_id
  AND (
    e.name = q.section
    OR LOWER(e.name) = LOWER(q.section)
    OR e.name ILIKE q.section
  );

-- Step 4: For questions still without exercise_id, try to match by
-- joining through books → chapters → exercises using chapter/section names
UPDATE questions q
SET
  exercise_id = e.id,
  updated_at = NOW()
FROM
  exercises e
  JOIN chapters c ON e.chapter_id = c.id
WHERE
  q.exercise_id IS NULL
  AND q.chapter IS NOT NULL
  AND q.section IS NOT NULL
  AND (
    -- Match chapter name
    c.title = q.chapter OR LOWER(c.title) = LOWER(q.chapter)
  )
  AND (
    -- Match exercise/section name
    e.name = q.section OR LOWER(e.name) = LOWER(q.section)
  );

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check how many questions now have exercise_id
SELECT
  'Questions with exercise_id' as status,
  COUNT(*) as count
FROM questions
WHERE exercise_id IS NOT NULL

UNION ALL

SELECT
  'Questions without exercise_id' as status,
  COUNT(*) as count
FROM questions
WHERE exercise_id IS NULL;

-- Check coverage by class
SELECT
  class_id,
  COUNT(*) as total_questions,
  COUNT(exercise_id) as with_exercise_id,
  COUNT(*) - COUNT(exercise_id) as without_exercise_id,
  ROUND(100.0 * COUNT(exercise_id) / COUNT(*), 2) as percent_covered
FROM questions
WHERE is_active = true
GROUP BY class_id
ORDER BY class_id;

-- Check Class 11 specifically
SELECT
  subject,
  COUNT(*) as total_questions,
  COUNT(exercise_id) as with_exercise_id,
  ROUND(100.0 * COUNT(exercise_id) / COUNT(*), 2) as percent_covered
FROM questions
WHERE class_id = '11'
  AND is_active = true
GROUP BY subject
ORDER BY subject;

-- Show sample of questions still without exercise_id
SELECT
  class_id,
  subject,
  chapter,
  section,
  COUNT(*) as question_count
FROM questions
WHERE exercise_id IS NULL
  AND is_active = true
GROUP BY class_id, subject, chapter, section
ORDER BY question_count DESC
LIMIT 20;
