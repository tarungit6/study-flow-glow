import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { NavLink } from "react-router-dom";

type Achievement = Database['public']['Tables']['achievements']['Row'];
type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('points', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUserAchievements = () => {
  return useQuery({
    queryKey: ['user-achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUserXP = () => {
  return useQuery({
    queryKey: ['user-xp'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_xp')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useXPTransactions = (limit = 10) => {
  return useQuery({
    queryKey: ['xp-transactions', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('xp_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
};

export const useLeaderboard = (limit = 10) => {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_xp')
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
};
