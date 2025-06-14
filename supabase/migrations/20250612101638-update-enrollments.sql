-- Drop existing foreign key constraint
ALTER TABLE public.enrollments 
DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey;

-- Add new foreign key constraint
ALTER TABLE public.enrollments
ADD CONSTRAINT enrollments_course_id_fkey 
FOREIGN KEY (course_id) 
REFERENCES public.educational_content(id) 
ON DELETE CASCADE;

-- Update RLS policies for enrollments
DROP POLICY IF EXISTS "Users can view their enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can create their enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Instructors can view all enrollments for their courses" ON public.enrollments;

-- Enable RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their enrollments" 
ON public.enrollments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their enrollments" 
ON public.enrollments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Instructors can view all enrollments for their content" 
ON public.enrollments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.educational_content 
    WHERE educational_content.id = enrollments.course_id 
    AND educational_content.instructor_id = auth.uid()
  )
); 