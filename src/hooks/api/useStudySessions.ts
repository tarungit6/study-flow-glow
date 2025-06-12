
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type StudySession = Database['public']['Tables']['study_sessions']['Row'];

export const useStudySessions = (limit = 10) => {
  return useQuery({
    queryKey: ['study-sessions', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_sessions')
        .select(`
          *,
          course:courses(title),
          lesson:course_lessons(title)
        `)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
};

export const useActiveStudySession = () => {
  return useQuery({
    queryKey: ['active-study-session'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .is('ended_at', null)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useStartStudySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, lessonId }: { courseId?: string; lessonId?: string }) => {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          course_id: courseId,
          lesson_id: lessonId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['active-study-session'] });
    },
  });
};

export const useEndStudySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const endTime = new Date().toISOString();
      
      // Get session start time to calculate duration
      const { data: session } = await supabase
        .from('study_sessions')
        .select('started_at')
        .eq('id', sessionId)
        .single();

      let durationMinutes = 0;
      if (session) {
        const startTime = new Date(session.started_at);
        const endTimeDate = new Date(endTime);
        durationMinutes = Math.floor((endTimeDate.getTime() - startTime.getTime()) / (1000 * 60));
      }

      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          ended_at: endTime,
          duration_minutes: durationMinutes,
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['active-study-session'] });
    },
  });
};
