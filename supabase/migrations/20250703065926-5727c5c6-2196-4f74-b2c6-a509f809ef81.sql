-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Update course_lesson_vectors table to include course_id and proper vector type
ALTER TABLE public.course_lesson_vectors 
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.educational_content(id);

-- Update embedding column to be proper vector type
ALTER TABLE public.course_lesson_vectors 
ALTER COLUMN embedding TYPE vector(1536);

-- Create index for faster vector similarity search
CREATE INDEX IF NOT EXISTS course_lesson_vectors_embedding_idx 
ON public.course_lesson_vectors 
USING ivfflat (embedding vector_cosine_ops);

-- Create function for getting lesson recommendations based on embedding similarity
CREATE OR REPLACE FUNCTION get_lesson_recommendations(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_course_id uuid DEFAULT NULL,
  filter_difficulty text DEFAULT NULL,
  filter_grade_level text DEFAULT NULL
)
RETURNS TABLE (
  lesson_id uuid,
  course_id uuid,
  similarity float,
  lesson_title text,
  lesson_content text,
  lesson_duration_minutes int,
  lesson_video_url text,
  course_title text,
  course_description text,
  course_subject text,
  course_difficulty text,
  course_grade_level text,
  instructor_name text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cl.id as lesson_id,
    ec.id as course_id,
    1 - (clv.embedding <=> query_embedding) as similarity,
    cl.title as lesson_title,
    cl.content as lesson_content,
    cl.duration_minutes as lesson_duration_minutes,
    cl.video_url as lesson_video_url,
    ec.title as course_title,
    ec.description as course_description,
    ec.subject as course_subject,
    ec.difficulty as course_difficulty,
    ec.grade_level as course_grade_level,
    p.full_name as instructor_name
  FROM course_lesson_vectors clv
  JOIN course_lessons cl ON clv.lesson_id = cl.id
  JOIN educational_content ec ON clv.course_id = ec.id
  JOIN profiles p ON ec.instructor_id = p.id
  WHERE 
    ec.is_published = true
    AND 1 - (clv.embedding <=> query_embedding) > match_threshold
    AND (filter_course_id IS NULL OR ec.id = filter_course_id)
    AND (filter_difficulty IS NULL OR ec.difficulty = filter_difficulty)
    AND (filter_grade_level IS NULL OR ec.grade_level = filter_grade_level)
  ORDER BY clv.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Enable RLS on course_lesson_vectors
ALTER TABLE public.course_lesson_vectors ENABLE ROW LEVEL SECURITY;

-- Create policy for reading embeddings
CREATE POLICY "Anyone can view lesson embeddings" 
ON public.course_lesson_vectors 
FOR SELECT 
USING (true);