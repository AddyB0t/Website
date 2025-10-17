-- Fix display_order for exercises named with letters (Exercise A, B, C, D, etc.)
-- These are typically used in Class 11 and Class 12

BEGIN;

-- Update Exercise A (letter A = 1st letter of alphabet)
UPDATE exercises
SET
  display_order = 100,  -- A = 100
  exercise_number = 1,
  updated_at = NOW()
WHERE
  name ILIKE 'Exercise A'
  AND (display_order = 0 OR display_order IS NULL);

-- Update Exercise B (letter B = 2nd letter of alphabet)
UPDATE exercises
SET
  display_order = 200,  -- B = 200
  exercise_number = 2,
  updated_at = NOW()
WHERE
  name ILIKE 'Exercise B'
  AND (display_order = 0 OR display_order IS NULL);

-- Update Exercise C (letter C = 3rd letter of alphabet)
UPDATE exercises
SET
  display_order = 300,  -- C = 300
  exercise_number = 3,
  updated_at = NOW()
WHERE
  name ILIKE 'Exercise C'
  AND (display_order = 0 OR display_order IS NULL);

-- Update Exercise D (letter D = 4th letter of alphabet)
UPDATE exercises
SET
  display_order = 400,  -- D = 400
  exercise_number = 4,
  updated_at = NOW()
WHERE
  name ILIKE 'Exercise D'
  AND (display_order = 0 OR display_order IS NULL);

-- Update Exercise E (letter E = 5th letter of alphabet)
UPDATE exercises
SET
  display_order = 500,  -- E = 500
  exercise_number = 5,
  updated_at = NOW()
WHERE
  name ILIKE 'Exercise E'
  AND (display_order = 0 OR display_order IS NULL);

-- Update Exercise F (letter F = 6th letter of alphabet)
UPDATE exercises
SET
  display_order = 600,  -- F = 600
  exercise_number = 6,
  updated_at = NOW()
WHERE
  name ILIKE 'Exercise F'
  AND (display_order = 0 OR display_order IS NULL);

COMMIT;

-- Verification: Show sample of updated exercises
SELECT
  c.title as chapter,
  e.name as exercise,
  e.exercise_number,
  e.display_order
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
JOIN books b ON c.book_id = b.id
WHERE b.class_level IN ('11', '12')
  AND e.name ~ '^Exercise [A-F]$'
ORDER BY c.title, e.display_order
LIMIT 20;
