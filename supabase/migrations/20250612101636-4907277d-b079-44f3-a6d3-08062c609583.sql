
-- Create enum types for various statuses and types
CREATE TYPE quiz_question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'essay');
CREATE TYPE quiz_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped', 'pending');
CREATE TYPE assignment_status AS ENUM ('draft', 'published', 'submitted', 'graded');
CREATE TYPE achievement_type AS ENUM ('course_completion', 'quiz_score', 'study_streak', 'participation', 'milestone');
CREATE TYPE notification_type AS ENUM ('assignment', 'quiz', 'course_update', 'achievement', 'community', 'system');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'announcement');

-- Courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES public.profiles(id) NOT NULL,
    tenant_id TEXT,
    cover_image_url TEXT,
    duration_hours INTEGER DEFAULT 0,
    difficulty_level TEXT DEFAULT 'beginner',
    category TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Course modules/chapters
CREATE TABLE public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Course lessons within modules
CREATE TABLE public.course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student enrollments
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'active',
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    UNIQUE(user_id, course_id)
);

-- Progress tracking for lessons
CREATE TABLE public.progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    time_spent_minutes INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

-- Daily goals and study tracking
CREATE TABLE public.daily_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_date DATE NOT NULL,
    target_minutes INTEGER NOT NULL DEFAULT 60,
    completed_minutes INTEGER DEFAULT 0,
    is_achieved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, goal_date)
);

-- Study sessions for time tracking
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id),
    lesson_id UUID REFERENCES public.course_lessons(id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quiz definitions
CREATE TABLE public.quiz_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 1,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    status quiz_status DEFAULT 'draft',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quiz questions
CREATE TABLE public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quiz_definitions(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type quiz_question_type NOT NULL,
    options JSONB, -- For multiple choice options
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quiz attempts by students
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quiz_definitions(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    score DECIMAL(5,2),
    max_score INTEGER,
    passed BOOLEAN DEFAULT false,
    answers JSONB, -- Store all answers
    time_taken_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assignments
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    max_points INTEGER DEFAULT 100,
    status assignment_status DEFAULT 'draft',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assignment submissions
CREATE TABLE public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    file_urls TEXT[],
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    grade DECIMAL(5,2),
    feedback TEXT,
    graded_by UUID REFERENCES public.profiles(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(assignment_id, user_id)
);

-- Study streaks tracking
CREATE TABLE public.study_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Activity logs for detailed tracking
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_date DATE NOT NULL,
    minutes_studied INTEGER DEFAULT 0,
    courses_accessed TEXT[],
    quizzes_taken INTEGER DEFAULT 0,
    assignments_submitted INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, activity_date)
);

-- Achievements system
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    achievement_type achievement_type NOT NULL,
    icon_url TEXT,
    points INTEGER DEFAULT 0,
    requirements JSONB, -- Flexible requirements definition
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User achievements earned
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- XP and leaderboard system
CREATE TABLE public.user_xp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    xp_to_next_level INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- XP transactions for tracking how XP was earned
CREATE TABLE public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id UUID, -- Can reference course, quiz, assignment, etc.
    reference_type TEXT, -- 'course_completion', 'quiz_passed', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Study spaces/groups for community
CREATE TABLE public.study_spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES public.courses(id),
    created_by UUID REFERENCES public.profiles(id),
    is_public BOOLEAN DEFAULT true,
    max_members INTEGER,
    tenant_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Study space memberships
CREATE TABLE public.study_space_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_id UUID REFERENCES public.study_spaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'admin', 'moderator', 'member'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(space_id, user_id)
);

-- Messages in study spaces
CREATE TABLE public.study_space_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_id UUID REFERENCES public.study_spaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    file_urls TEXT[],
    reply_to_id UUID REFERENCES public.study_space_messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Recommendations
CREATE TABLE public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL, -- 'course', 'study_time', 'review', etc.
    title TEXT NOT NULL,
    description TEXT,
    action_url TEXT,
    priority INTEGER DEFAULT 1, -- 1 = high, 2 = medium, 3 = low
    is_dismissed BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications system
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type notification_type NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    reference_id UUID,
    reference_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_space_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_space_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users to access their own data
CREATE POLICY "Users can view their enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their progress" ON public.progress_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their progress" ON public.progress_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can modify their progress" ON public.progress_logs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their goals" ON public.daily_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their goals" ON public.daily_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their goals" ON public.daily_goals FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their study sessions" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create study sessions" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their sessions" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their quiz attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their attempts" ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their submissions" ON public.assignment_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create submissions" ON public.assignment_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their submissions" ON public.assignment_submissions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their streaks" ON public.study_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their streaks" ON public.study_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their streaks" ON public.study_streaks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their activity" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their XP" ON public.user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their XP transactions" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their recommendations" ON public.recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their recommendations" ON public.recommendations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for courses, achievements, etc.
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can view course modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Anyone can view course lessons" ON public.course_lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view quiz definitions" ON public.quiz_definitions FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can view assignments" ON public.assignments FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view study spaces" ON public.study_spaces FOR SELECT USING (is_public = true);

-- Study space member policies
CREATE POLICY "Users can view spaces they're members of" ON public.study_space_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join study spaces" ON public.study_space_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can view messages in their spaces" ON public.study_space_messages 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.study_space_members 
    WHERE space_id = study_space_messages.space_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Members can create messages in their spaces" ON public.study_space_messages 
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.study_space_members 
    WHERE space_id = study_space_messages.space_id 
    AND user_id = auth.uid()
  )
);

-- Instructor policies
CREATE POLICY "Instructors can manage their courses" ON public.courses 
FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can view all enrollments for their courses" ON public.enrollments 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = enrollments.course_id 
    AND courses.instructor_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_progress_logs_user_id ON public.progress_logs(user_id);
CREATE INDEX idx_progress_logs_lesson_id ON public.progress_logs(lesson_id);
CREATE INDEX idx_daily_goals_user_date ON public.daily_goals(user_id, goal_date);
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_recommendations_user_active ON public.recommendations(user_id, is_dismissed);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_study_space_messages_space_id ON public.study_space_messages(space_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_xp_transactions_user_id ON public.xp_transactions(user_id);

-- Insert some sample achievements
INSERT INTO public.achievements (title, description, achievement_type, points, requirements) VALUES
('First Steps', 'Complete your first lesson', 'milestone', 10, '{"lessons_completed": 1}'),
('Quick Learner', 'Complete a course in under 24 hours', 'course_completion', 50, '{"course_completion_time_hours": 24}'),
('Quiz Master', 'Score 100% on any quiz', 'quiz_score', 25, '{"quiz_score_percentage": 100}'),
('Consistent Learner', 'Study for 7 days in a row', 'study_streak', 30, '{"streak_days": 7}'),
('Monthly Warrior', 'Study for 30 days in a row', 'study_streak', 100, '{"streak_days": 30}'),
('Participator', 'Post 10 messages in study spaces', 'participation', 20, '{"messages_posted": 10}'),
('Course Crusher', 'Complete 5 courses', 'course_completion', 75, '{"courses_completed": 5}');
