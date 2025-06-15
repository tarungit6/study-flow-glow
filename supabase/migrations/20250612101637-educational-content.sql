-- Create educational_content table
CREATE TABLE public.educational_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    content_type TEXT NOT NULL,
    subject TEXT,
    grade_level TEXT,
    topic TEXT,
    difficulty TEXT DEFAULT 'medium',
    concepts TEXT[],
    is_published BOOLEAN DEFAULT false,
    instructor_id UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on educational_content table
ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;

-- Create policies for educational_content table
CREATE POLICY "Anyone can view published educational content" 
ON public.educational_content FOR SELECT 
USING (is_published = true);

CREATE POLICY "Instructors can manage their educational content" 
ON public.educational_content FOR ALL 
USING (auth.uid() = instructor_id);

-- Create index for better performance
CREATE INDEX idx_educational_content_instructor ON public.educational_content(instructor_id);
CREATE INDEX idx_educational_content_published ON public.educational_content(is_published); 