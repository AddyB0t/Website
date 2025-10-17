-- ============================================================================
-- COMPREHENSIVE EXERCISE NUMBERING FIX FOR ALL CLASSES
-- ============================================================================
-- This script extracts exercise numbers from exercise names and updates
-- the exercise_number and display_order fields for proper sorting.
--
-- FIXES DECIMAL EXERCISE SORTING:
-- Exercise 1.2 → display_order = 102
-- Exercise 1.6 → display_order = 106
-- Exercise 1.10 → display_order = 110
-- Exercise 11 → display_order = 1100
--
-- This ensures proper numeric sorting instead of string sorting
-- ============================================================================

BEGIN;

-- Step 1: Handle exercises with decimal numbers like "Exercise 1.6", "Exercise 1.10"
-- This must come FIRST to avoid conflicts with simple number extraction
UPDATE exercises
SET
  exercise_number = CAST(SPLIT_PART(REGEXP_REPLACE(name, '[^0-9.]', '', 'g'), '.', 1) AS INTEGER),
  display_order = (
    -- First part (before decimal) * 100 + second part (after decimal)
    -- Exercise 1.6 → 1*100 + 6 = 106
    -- Exercise 1.10 → 1*100 + 10 = 110
    CAST(SPLIT_PART(REGEXP_REPLACE(name, '[^0-9.]', '', 'g'), '.', 1) AS INTEGER) * 100 +
    COALESCE(CAST(NULLIF(SPLIT_PART(REGEXP_REPLACE(name, '[^0-9.]', '', 'g'), '.', 2), '') AS INTEGER), 0)
  ),
  updated_at = NOW()
WHERE
  name ~ 'Exercise\s+[0-9]+\.[0-9]+'  -- Matches "Exercise N.M" pattern (removed ^ and $ to be more flexible)
  AND name ~ '\.'  -- Must contain a decimal point
  AND (
    exercise_number IS NULL
    OR display_order IS NULL
    OR display_order = 0
    OR display_order != (
      CAST(SPLIT_PART(REGEXP_REPLACE(name, '[^0-9.]', '', 'g'), '.', 1) AS INTEGER) * 100 +
      COALESCE(CAST(NULLIF(SPLIT_PART(REGEXP_REPLACE(name, '[^0-9.]', '', 'g'), '.', 2), '') AS INTEGER), 0)
    )
  );

-- Step 2: Extract exercise number from name for simple exercises "Exercise N"
-- Pattern: "Exercise 1", "Exercise 2", "Exercise 10", "Exercise 11", etc.
-- For these, multiply by 100 to keep them separate from decimal exercises
-- Exercise 11 → display_order = 1100 (so it comes after Exercise 1.10 which is 110)
UPDATE exercises
SET
  exercise_number = CAST(REGEXP_REPLACE(name, '[^0-9]', '', 'g') AS INTEGER),
  display_order = CAST(REGEXP_REPLACE(name, '[^0-9]', '', 'g') AS INTEGER) * 100,  -- Multiply by 100
  updated_at = NOW()
WHERE
  name ~ 'Exercise\s+[0-9]+'  -- Matches "Exercise N" pattern
  AND name !~ '\.'  -- Must NOT contain a decimal point (to avoid matching Exercise 1.6)
  AND (
    exercise_number IS NULL
    OR display_order IS NULL
    OR display_order = 0
    OR display_order != CAST(REGEXP_REPLACE(name, '[^0-9]', '', 'g') AS INTEGER) * 100
  );

-- Step 3: For any remaining exercises with NULL display_order, set it to exercise_number * 100
UPDATE exercises
SET
  display_order = exercise_number * 100,
  updated_at = NOW()
WHERE
  display_order IS NULL
  AND exercise_number IS NOT NULL;

-- Step 4: For exercises with display_order = 0, set to exercise_number * 100 if available
UPDATE exercises
SET
  display_order = exercise_number * 100,
  updated_at = NOW()
WHERE
  display_order = 0
  AND exercise_number IS NOT NULL
  AND exercise_number > 0;

-- Step 5: For exercises without exercise_number but with display_order, calculate it
UPDATE exercises
SET
  exercise_number = CASE
    WHEN display_order >= 100 THEN display_order / 100
    ELSE display_order
  END,
  updated_at = NOW()
WHERE
  exercise_number IS NULL
  AND display_order IS NOT NULL
  AND display_order > 0;

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check the results for all classes - ORDERED BY display_order for proper sorting
SELECT
  b.class_level,
  s.name as subject_name,
  c.title as chapter_name,
  e.name as exercise_name,
  e.exercise_number,
  e.display_order,
  COUNT(q.id) as question_count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
JOIN books b ON c.book_id = b.id
LEFT JOIN subjects s ON b.subject_id = s.id
LEFT JOIN questions q ON q.exercise_id = e.id AND q.is_active = true
WHERE b.class_level IN ('7', '8', '9', '10', '11', '12')
GROUP BY b.class_level, s.name, c.title, e.id, e.name, e.exercise_number, e.display_order
ORDER BY b.class_level, s.name, c.title, e.display_order NULLS LAST;

-- Show exercises for a specific chapter to verify ordering (e.g., Force chapter)
SELECT
  c.title as chapter_name,
  e.name as exercise_name,
  e.exercise_number,
  e.display_order,
  COUNT(q.id) as question_count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
LEFT JOIN questions q ON q.exercise_id = e.id AND q.is_active = true
WHERE c.title ILIKE '%Force%'
GROUP BY c.title, e.id, e.name, e.exercise_number, e.display_order
ORDER BY e.display_order NULLS LAST;

-- Count exercises that still have issues
SELECT
  'Exercises with NULL exercise_number' as issue_type,
  COUNT(*) as count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
JOIN books b ON c.book_id = b.id
WHERE b.class_level IN ('7', '8', '9', '10', '11', '12')
  AND e.exercise_number IS NULL

UNION ALL

SELECT
  'Exercises with NULL or 0 display_order' as issue_type,
  COUNT(*) as count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
JOIN books b ON c.book_id = b.id
WHERE b.class_level IN ('7', '8', '9', '10', '11', '12')
  AND (e.display_order IS NULL OR e.display_order = 0)

UNION ALL

SELECT
  'Total exercises' as issue_type,
  COUNT(*) as count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
JOIN books b ON c.book_id = b.id
WHERE b.class_level IN ('7', '8', '9', '10', '11', '12');

-- Show exercises by class
SELECT
  b.class_level,
  COUNT(DISTINCT c.id) as chapter_count,
  COUNT(e.id) as exercise_count,
  COUNT(q.id) as question_count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
JOIN books b ON c.book_id = b.id
LEFT JOIN questions q ON q.exercise_id = e.id AND q.is_active = true
WHERE b.class_level IN ('7', '8', '9', '10', '11', '12')
GROUP BY b.class_level
ORDER BY b.class_level;

-- ============================================================================
-- EXAMPLE EXPECTED RESULTS:
-- ============================================================================
-- Exercise 1.2  → exercise_number=1, display_order=102
-- Exercise 1.3  → exercise_number=1, display_order=103
-- Exercise 1.6  → exercise_number=1, display_order=106
-- Exercise 1.7  → exercise_number=1, display_order=107
-- Exercise 1.8  → exercise_number=1, display_order=108
-- Exercise 1.9  → exercise_number=1, display_order=109
-- Exercise 1.10 → exercise_number=1, display_order=110
-- Exercise 1.11 → exercise_number=1, display_order=111
-- Exercise 11   → exercise_number=11, display_order=1100
