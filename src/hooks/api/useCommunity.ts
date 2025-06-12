
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type StudySpace = Database['public']['Tables']['study_spaces']['Row'];
type StudySpaceMessage = Database['public']['Tables']['study_space_messages']['Row'];

export const useStudySpaces = () => {
  return useQuery({
    queryKey: ['study-spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_spaces')
        .select(`
          *,
          creator:profiles!created_by(full_name),
          course:courses(title),
          study_space_members(
            id,
            user:profiles(full_name)
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useStudySpace = (spaceId: string) => {
  return useQuery({
    queryKey: ['study-space', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_spaces')
        .select(`
          *,
          creator:profiles!created_by(full_name),
          course:courses(title),
          study_space_members(
            *,
            user:profiles(full_name, avatar_url)
          )
        `)
        .eq('id', spaceId)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useStudySpaceMessages = (spaceId: string) => {
  return useQuery({
    queryKey: ['study-space-messages', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_space_messages')
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .eq('space_id', spaceId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useJoinStudySpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (spaceId: string) => {
      const { data, error } = await supabase
        .from('study_space_members')
        .insert({
          space_id: spaceId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-spaces'] });
      queryClient.invalidateQueries({ queryKey: ['study-space'] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      spaceId, 
      content, 
      messageType = 'text' 
    }: { 
      spaceId: string; 
      content: string; 
      messageType?: string;
    }) => {
      const { data, error } = await supabase
        .from('study_space_messages')
        .insert({
          space_id: spaceId,
          content,
          message_type: messageType as any,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['study-space-messages', variables.spaceId] });
    },
  });
};

export const useCreateStudySpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      name, 
      description, 
      courseId 
    }: { 
      name: string; 
      description?: string; 
      courseId?: string;
    }) => {
      const { data, error } = await supabase
        .from('study_spaces')
        .insert({
          name,
          description,
          course_id: courseId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-spaces'] });
    },
  });
};
