
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ProgressLog = Database['public']['Tables']['progress_logs']['Row'];

export const useProgressLogs = (courseId?: string) => {
  return useQuery({
    queryKey: ['progress-logs', courseId],
    queryFn: async () => {
      let query = supabase
        .from('progress_logs')
        .select(`
          *,
          lesson:course_lessons(
            *,
            module:course_modules(
              *,
              course:courses(*)
            )
          )
        `);

      if (courseId) {
        query = query.eq('lesson.module.course.id', courseId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useLessonProgress = (lessonId: string) => {
  return useQuery({
    queryKey: ['lesson-progress', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      lessonId, 
      timeSpent, 
      completed 
    }: { 
      lessonId: string; 
      timeSpent: number; 
      completed: boolean;
    }) => {
      const { data, error } = await supabase
        .from('progress_logs')
        .upsert({
          lesson_id: lessonId,
          time_spent_minutes: timeSpent,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress-logs'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};
