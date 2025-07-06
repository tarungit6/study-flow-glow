-- Fix the data inconsistency: Update course_lessons to reference the correct module_id
UPDATE course_lessons 
SET module_id = '8b3c1f55-1e2a-4a67-91e9-0d3eaf9b6f01' 
WHERE module_id = 'e6a805b6-0d30-46b1-bd9f-94df3b5b883d';