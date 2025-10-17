-- Check what exercises exist for Shares and Dividends chapter
SELECT DISTINCT e.name, e.exercise_number, e.display_order
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
WHERE c.name ILIKE '%Shares and Dividends%'
  AND c.class_level = '10'
ORDER BY e.display_order, e.exercise_number;

-- Count questions per exercise for this chapter
SELECT 
  e.name as exercise_name,
  e.exercise_number,
  e.display_order,
  COUNT(q.id) as question_count
FROM exercises e
JOIN chapters c ON e.chapter_id = c.id
LEFT JOIN questions q ON q.exercise_id = e.id AND q.is_active = true
WHERE c.name ILIKE '%Shares and Dividends%'
  AND c.class_level = '10'
GROUP BY e.id, e.name, e.exercise_number, e.display_order
ORDER BY e.display_order, e.exercise_number;
