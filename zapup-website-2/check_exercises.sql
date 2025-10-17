-- Check how many questions have exercise_id vs don't have it
SELECT 
  class_id,
  subject,
  COUNT(*) as total_questions,
  COUNT(exercise_id) as with_exercise_id,
  COUNT(*) - COUNT(exercise_id) as without_exercise_id
FROM questions
WHERE is_active = true
GROUP BY class_id, subject
ORDER BY class_id, subject
LIMIT 20;
