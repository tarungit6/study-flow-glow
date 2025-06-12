import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type StudySession = Database['public']['Tables']['study_sessions']['Row'];
type StudySessionInsert = Database['public']['Tables']['study_sessions']['Insert'];
type DailyGoal = Database['public']['Tables']['daily_goals']['Row'];

export const useStudySession = (userId?: string) => {
  const queryClient = useQueryClient();

  // Get active study session
  const { data: activeSession, isLoading: isLoadingActiveSession } = useQuery({
    queryKey: ['active-study-session', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .is('ended_at', null)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return data as StudySession | null;
    },
    enabled: !!userId,
  });

  // Get today's goal
  const { data: todayGoal, isLoading: isLoadingTodayGoal } = useQuery({
    queryKey: ['today-goal', userId],
    queryFn: async () => {
      if (!userId) return null;
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('goal_date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as DailyGoal | null;
    },
    enabled: !!userId,
  });

  // Start a new study session
  const startSession = useMutation({
    mutationFn: async (session: Omit<StudySessionInsert, 'user_id' | 'started_at'>) => {
      if (!userId) throw new Error('No user ID provided');
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          ...session,
          user_id: userId,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as StudySession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-study-session', userId] });
      toast.success('Study session started!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // End the current study session
  const endSession = useMutation({
    mutationFn: async () => {
      if (!activeSession?.id) throw new Error('No active session found');
      
      const endedAt = new Date();
      const startedAt = new Date(activeSession.started_at!);
      const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / (1000 * 60));

      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          ended_at: endedAt.toISOString(),
          duration_minutes: durationMinutes,
        })
        .eq('id', activeSession.id)
        .select()
        .single();

      if (error) throw error;

      // Update today's goal progress
      if (todayGoal) {
        const newCompletedMinutes = (todayGoal.completed_minutes || 0) + durationMinutes;
        const isAchieved = newCompletedMinutes >= todayGoal.target_minutes;

        await supabase
          .from('daily_goals')
          .update({
            completed_minutes: newCompletedMinutes,
            is_achieved: isAchieved,
          })
          .eq('id', todayGoal.id);

        // Add XP for completing study session
        await supabase.from('xp_transactions').insert({
          user_id: userId,
          amount: durationMinutes, // 1 XP per minute
          reason: 'Study session completed',
          reference_id: activeSession.id,
          reference_type: 'study_session',
        });

        // Check for achievements
        if (isAchieved && !todayGoal.is_achieved) {
          // Award achievement for completing daily goal
          const { data: achievement } = await supabase
            .from('achievements')
            .select('id')
            .eq('achievement_type', 'study_streak')
            .single();

          if (achievement) {
            await supabase.from('user_achievements').insert({
              user_id: userId,
              achievement_id: achievement.id,
              earned_at: new Date().toISOString(),
            });
          }
        }
      }

      return data as StudySession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-study-session', userId] });
      queryClient.invalidateQueries({ queryKey: ['today-goal', userId] });
      queryClient.invalidateQueries({ queryKey: ['user-xp'] });
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      toast.success('Study session ended! Great job!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Create or update today's goal
  const setDailyGoal = useMutation({
    mutationFn: async (targetMinutes: number) => {
      if (!userId) throw new Error('No user ID provided');
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_goals')
        .upsert({
          user_id: userId,
          goal_date: today,
          target_minutes: targetMinutes,
          completed_minutes: 0,
          is_achieved: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as DailyGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-goal', userId] });
      toast.success('Daily goal set!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    activeSession,
    todayGoal,
    isLoading: isLoadingActiveSession || isLoadingTodayGoal,
    startSession,
    endSession,
    setDailyGoal,
  };
}; 