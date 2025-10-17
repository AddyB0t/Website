-- Verify Exercises Table Structure for Class 10 Mathematics
-- This script checks if exercises have proper numbering and ordering

-- 1. Check all exercises for Class 10 Mathematics with their numbers and display order
SELECT
  c.name as chapter_name,
  e.name as exercise_name,
  e.exercise_number,
  e.display_order,
  COUNT(q.id) as question_count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
LEFT JOIN questions q ON q.exercise_id = e.id AND q.is_active = true
WHERE c.class_level = '10'
  AND c.subject ILIKE '%mathematics%'
GROUP BY c.name, e.id, e.name, e.exercise_number, e.display_order
ORDER BY c.name, e.display_order, e.exercise_number;

-- 2. Check for exercises with NULL or 0 display_order (these won't sort properly)
SELECT
  c.name as chapter_name,
  e.name as exercise_name,
  e.exercise_number,
  e.display_order,
  COUNT(q.id) as question_count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
LEFT JOIN questions q ON q.exercise_id = e.id AND q.is_active = true
WHERE c.class_level = '10'
  AND c.subject ILIKE '%mathematics%'
  AND (e.display_order IS NULL OR e.display_order = 0)
GROUP BY c.name, e.id, e.name, e.exercise_number, e.display_order
ORDER BY c.name;

-- 3. Check for exercises with NULL exercise_number
SELECT
  c.name as chapter_name,
  e.name as exercise_name,
  e.exercise_number,
  e.display_order,
  COUNT(q.id) as question_count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
LEFT JOIN questions q ON q.exercise_id = e.id AND q.is_active = true
WHERE c.class_level = '10'
  AND c.subject ILIKE '%mathematics%'
  AND e.exercise_number IS NULL
GROUP BY c.name, e.id, e.name, e.exercise_number, e.display_order
ORDER BY c.name;

-- 4. Suggested fix: Update display_order to match exercise_number where needed
-- (Run this only after reviewing the results above)
/*
UPDATE exercises e
SET display_order = e.exercise_number
FROM chapters c
WHERE e.chapter_id = c.id
  AND c.class_level = '10'
  AND c.subject ILIKE '%mathematics%'
  AND (e.display_order IS NULL OR e.display_order = 0 OR e.display_order != e.exercise_number);
*/

-- 5. Extract exercise number from exercise name and update if missing
-- For exercises named "Exercise 1", "Exercise 2", etc.
/*
UPDATE exercises e
SET exercise_number = CAST(REGEXP_REPLACE(e.name, '[^0-9]', '', 'g') AS INTEGER)
FROM chapters c
WHERE e.chapter_id = c.id
  AND c.class_level = '10'
  AND c.subject ILIKE '%mathematics%'
  AND e.exercise_number IS NULL
  AND e.name ~ 'Exercise [0-9]+';
*/
