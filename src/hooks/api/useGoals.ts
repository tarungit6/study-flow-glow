
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type DailyGoal = Database['public']['Tables']['daily_goals']['Row'];
type DailyGoalInsert = Database['public']['Tables']['daily_goals']['Insert'];
type DailyGoalUpdate = Database['public']['Tables']['daily_goals']['Update'];

export const useDailyGoals = (limit = 7) => {
  return useQuery({
    queryKey: ['daily-goals', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_goals')
        .select('*')
        .order('goal_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
};

export const useTodayGoal = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['daily-goal', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_goals')
        .select('*')
        .eq('goal_date', today)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateDailyGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalDate, targetMinutes }: { goalDate: string; targetMinutes: number }) => {
      const { data, error } = await supabase
        .from('daily_goals')
        .upsert({
          goal_date: goalDate,
          target_minutes: targetMinutes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-goals'] });
      queryClient.invalidateQueries({ queryKey: ['daily-goal'] });
    },
  });
};

export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, completedMinutes }: { goalId: string; completedMinutes: number }) => {
      const { data, error } = await supabase
        .from('daily_goals')
        .update({
          completed_minutes: completedMinutes,
          is_achieved: completedMinutes >= (await supabase.from('daily_goals').select('target_minutes').eq('id', goalId).single()).data?.target_minutes || 0,
        })
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-goals'] });
      queryClient.invalidateQueries({ queryKey: ['daily-goal'] });
    },
  });
};
