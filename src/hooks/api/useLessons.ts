
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useLessons = (courseId: string) => {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      console.log('Fetching lessons for course:', courseId);
      
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      console.log('Lessons data:', data);
      console.log('Error:', error);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data;
    },
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

      console.log('Marking lesson complete:', lessonId);

      // Create progress log entry
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
        console.error('Progress log error:', progressError);
        throw new Error(progressError.message || 'Failed to mark lesson complete');
      }

      console.log('Progress logged:', progressData);
      return progressData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['progress-logs'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};
