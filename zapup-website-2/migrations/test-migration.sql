-- Test if the question image linking columns exist
-- Run this to verify the migration was successful

SELECT
    column_name,
    data_type,
    is_nullable
FROM
    information_schema.columns
WHERE
    table_name = 'uploaded_question_images'
    AND column_name IN ('question_id', 'is_community', 'linked_at')
ORDER BY
    column_name;

-- Check if indexes were created
SELECT
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    tablename = 'uploaded_question_images'
    AND indexname LIKE '%question%'
ORDER BY
    indexname;

-- Check if RLS policy exists
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual
FROM
    pg_policies
WHERE
    tablename = 'uploaded_question_images'
ORDER BY
    policyname;
