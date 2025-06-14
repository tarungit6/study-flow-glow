
-- Alter quiz_definitions table to add new columns
ALTER TABLE public.quiz_definitions
  ADD COLUMN IF NOT EXISTS subject TEXT NULL,
  ADD COLUMN IF NOT EXISTS grade_level TEXT NULL,
  ADD COLUMN IF NOT EXISTS topic TEXT NULL,
  ADD COLUMN IF NOT EXISTS difficulty TEXT NULL,
  ADD COLUMN IF NOT EXISTS instructions TEXT NULL;

-- Alter quiz_questions table to add new columns
ALTER TABLE public.quiz_questions
  ADD COLUMN IF NOT EXISTS explanation TEXT NULL,
  ADD COLUMN IF NOT EXISTS concept TEXT NULL;

-- Enable RLS and set up policies for quiz_definitions
ALTER TABLE public.quiz_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Instructors can manage their own quizzes" ON public.quiz_definitions;
CREATE POLICY "Instructors can manage their own quizzes"
  ON public.quiz_definitions
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'instructor')
  WITH CHECK (created_by = auth.uid() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'instructor');

DROP POLICY IF EXISTS "Authenticated users can view published quizzes" ON public.quiz_definitions;
CREATE POLICY "Authenticated users can view published quizzes"
  ON public.quiz_definitions
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Enable RLS and set up policies for quiz_questions
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Instructors can manage questions for their quizzes" ON public.quiz_questions;
CREATE POLICY "Instructors can manage questions for their quizzes"
  ON public.quiz_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_definitions qd
      WHERE qd.id = quiz_questions.quiz_id AND qd.created_by = auth.uid() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'instructor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_definitions qd
      WHERE qd.id = quiz_questions.quiz_id AND qd.created_by = auth.uid() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'instructor'
    )
  );

DROP POLICY IF EXISTS "Authenticated users can view questions of published quizzes" ON public.quiz_questions;
CREATE POLICY "Authenticated users can view questions of published quizzes"
  ON public.quiz_questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_definitions qd
      WHERE qd.id = quiz_questions.quiz_id AND qd.status = 'published'
    )
  );

-- Enable RLS and set up policies for quiz_attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can manage their own quiz attempts"
  ON public.quiz_attempts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

