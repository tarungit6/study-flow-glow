
-- Create educational_content table
CREATE TABLE public.educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT, -- For YouTube links or other resource URLs
  content_type TEXT, -- e.g., 'video', 'document', 'quiz_link'
  subject TEXT,
  grade_level TEXT,
  topic TEXT,
  difficulty TEXT, -- e.g., 'easy', 'medium', 'hard'
  concepts TEXT[], -- Array of concept tags
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;

-- Policies for instructors
CREATE POLICY "Instructors can insert their own content"
  ON public.educational_content
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'instructor'
    AND instructor_id = auth.uid()
  );

CREATE POLICY "Instructors can view their own content"
  ON public.educational_content
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'instructor'
    AND instructor_id = auth.uid()
  );

CREATE POLICY "Instructors can update their own content"
  ON public.educational_content
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'instructor'
    AND instructor_id = auth.uid()
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'instructor'
    AND instructor_id = auth.uid()
  );

CREATE POLICY "Instructors can delete their own content"
  ON public.educational_content
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'instructor'
    AND instructor_id = auth.uid()
  );

-- Policy for authenticated users to view published content
CREATE POLICY "Authenticated users can view published content"
  ON public.educational_content
  FOR SELECT
  TO authenticated
  USING (is_published = TRUE);

-- Add indexes for frequently queried columns
CREATE INDEX idx_educational_content_instructor_id ON public.educational_content(instructor_id);
CREATE INDEX idx_educational_content_subject ON public.educational_content(subject);
CREATE INDEX idx_educational_content_is_published ON public.educational_content(is_published);
CREATE INDEX idx_educational_content_concepts ON public.educational_content USING GIN (concepts);

