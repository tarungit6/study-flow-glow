import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ✅ Define type for a lesson explicitly
export interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
  module_id: string | null;
  created_at: string;
}

export const useLessons = (courseId: string) => {
  return useQuery<Lesson[]>({
    queryKey: ['lessons', courseId],
    queryFn: async (): Promise<Lesson[]> => {
      const { data, error } = await supabase
        .from('course_lessons')
        .select(
          `
          id,
          title,
          content,
          video_url,
          duration_minutes,
          order_index,
          module_id,
          created_at
        `
        );

      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !!courseId,
  });
};


export const useLesson = (lessonId: string) => {
  return useQuery<Lesson>({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data as Lesson;
    },
    enabled: !!lessonId,
  });
};

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ lessonId, timeSpent }: { lessonId: string; timeSpent: number }) => {
      if (!user) {
        throw new Error('You must be logged in to mark lessons complete');
      }

      const { data: progressData, error: progressError } = await supabase
        .from('progress_logs')
        .upsert({
          lesson_id: lessonId,
          user_id: user.id,
          completed: true,
          completed_at: new Date().toISOString(),
          time_spent_minutes: timeSpent
        })
        .select()
        .single();

      if (progressError) {
        throw new Error(progressError.message || 'Failed to mark lesson complete');
      }

      return progressData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['progress-logs'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};
