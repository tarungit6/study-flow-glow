
export interface Instructor {
  id: string;
  full_name: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  url: string;
  content_type: string;
  subject: string;
  grade_level: string;
  topic: string;
  difficulty: string;
  difficulty_level?: string;
  category?: string;
  duration_hours?: number;
  concepts: string[];
  is_published: boolean;
  instructor_id: string;
  instructor: Instructor;
  created_at: string;
  updated_at: string;
  enrollments?: Array<{ id: string }>;
}

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress_percentage: number;
  status: 'active' | 'completed' | 'dropped' | 'pending';
  content: {
    id: string;
    title: string;
    instructor?: { full_name: string };
    subject?: string;
    difficulty?: string;
    url?: string;
  };
};

