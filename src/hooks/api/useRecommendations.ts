
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Recommendation = Database['public']['Tables']['recommendations']['Row'];

export const useRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('is_dismissed', false)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useDismissRecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recommendationId: string) => {
      const { data, error } = await supabase
        .from('recommendations')
        .update({ is_dismissed: true })
        .eq('id', recommendationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};
