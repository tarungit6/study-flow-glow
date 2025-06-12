
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type StudyStreak = Database['public']['Tables']['study_streaks']['Row'];

export const useStudyStreak = () => {
  return useQuery({
    queryKey: ['study-streak'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_streaks')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useActivityLogs = (limit = 7) => {
  return useQuery({
    queryKey: ['activity-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('activity_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateStudyStreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current streak
      const { data: currentStreak } = await supabase
        .from('study_streaks')
        .select('*')
        .maybeSingle();

      let newStreakData = {
        current_streak: 1,
        longest_streak: 1,
        last_study_date: today,
      };

      if (currentStreak) {
        const lastStudyDate = new Date(currentStreak.last_study_date || '');
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          // Consecutive day
          newStreakData.current_streak = currentStreak.current_streak + 1;
          newStreakData.longest_streak = Math.max(currentStreak.longest_streak, newStreakData.current_streak);
        } else if (daysDiff > 1) {
          // Streak broken
          newStreakData.current_streak = 1;
          newStreakData.longest_streak = currentStreak.longest_streak;
        } else {
          // Same day, no update needed
          return currentStreak;
        }
      }

      const { data, error } = await supabase
        .from('study_streaks')
        .upsert(newStreakData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-streak'] });
    },
  });
};
