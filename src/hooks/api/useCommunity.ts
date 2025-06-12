import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type StudySpace = Database['public']['Tables']['study_spaces']['Row'];
type StudySpaceInsert = Database['public']['Tables']['study_spaces']['Insert'];
type StudySpaceUpdate = Database['public']['Tables']['study_spaces']['Update'];
type StudySpaceMember = Database['public']['Tables']['study_space_members']['Row'];
type StudySpaceMessage = Database['public']['Tables']['study_space_messages']['Row'];
type StudySpaceMessageInsert = Database['public']['Tables']['study_space_messages']['Insert'];

export const useCommunity = (userId?: string) => {
  const queryClient = useQueryClient();

  // Get all study spaces
  const { data: studySpaces, isLoading: isLoadingSpaces } = useQuery({
    queryKey: ['study-spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_spaces')
        .select(`
          *,
          created_by_user:profiles!study_spaces_created_by_fkey(full_name, avatar_url),
          course:courses(title),
          member_count:study_space_members(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (StudySpace & {
        created_by_user: { full_name: string; avatar_url: string | null };
        course: { title: string } | null;
        member_count: { count: number }[];
      })[];
    },
  });

  // Get user's study spaces
  const { data: userSpaces, isLoading: isLoadingUserSpaces } = useQuery({
    queryKey: ['user-study-spaces', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('study_space_members')
        .select(`
          *,
          space:study_spaces(
            *,
            created_by_user:profiles!study_spaces_created_by_fkey(full_name, avatar_url),
            course:courses(title),
            member_count:study_space_members(count)
          )
        `)
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return data as (StudySpaceMember & {
        space: StudySpace & {
          created_by_user: { full_name: string; avatar_url: string | null };
          course: { title: string } | null;
          member_count: { count: number }[];
        };
      })[];
    },
    enabled: !!userId,
  });

  // Get study space messages
  const getSpaceMessages = (spaceId: string) => {
    return useQuery({
      queryKey: ['study-space-messages', spaceId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('study_space_messages')
          .select(`
            *,
            user:profiles(full_name, avatar_url),
            replies:study_space_messages(*, user:profiles(full_name, avatar_url))
          `)
          .eq('space_id', spaceId)
          .is('reply_to_id', null)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as (StudySpaceMessage & {
          user: { full_name: string; avatar_url: string | null };
          replies: (StudySpaceMessage & {
            user: { full_name: string; avatar_url: string | null };
          })[];
        })[];
      },
      enabled: !!spaceId,
    });
  };

  // Create a new study space
  const createStudySpace = useMutation({
    mutationFn: async (space: Omit<StudySpaceInsert, 'created_by'>) => {
      if (!userId) throw new Error('No user ID provided');
      const { data, error } = await supabase
        .from('study_spaces')
        .insert({
          ...space,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as a member
      await supabase.from('study_space_members').insert({
        space_id: data.id,
        user_id: userId,
        role: 'admin',
        joined_at: new Date().toISOString(),
      });

      return data as StudySpace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-spaces'] });
      queryClient.invalidateQueries({ queryKey: ['user-study-spaces'] });
      toast.success('Study space created successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Join a study space
  const joinStudySpace = useMutation({
    mutationFn: async (spaceId: string) => {
      if (!userId) throw new Error('No user ID provided');
      const { data, error } = await supabase
        .from('study_space_members')
        .insert({
          space_id: spaceId,
          user_id: userId,
          role: 'member',
          joined_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as StudySpaceMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-spaces'] });
      queryClient.invalidateQueries({ queryKey: ['user-study-spaces'] });
      toast.success('Joined study space successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Leave a study space
  const leaveStudySpace = useMutation({
    mutationFn: async (spaceId: string) => {
      if (!userId) throw new Error('No user ID provided');
      const { error } = await supabase
        .from('study_space_members')
        .delete()
        .eq('space_id', spaceId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-spaces'] });
      queryClient.invalidateQueries({ queryKey: ['user-study-spaces'] });
      toast.success('Left study space successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Send a message
  const sendMessage = useMutation({
    mutationFn: async (message: Omit<StudySpaceMessageInsert, 'user_id'>) => {
      if (!userId) throw new Error('No user ID provided');
      const { data, error } = await supabase
        .from('study_space_messages')
        .insert({
          ...message,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data as StudySpaceMessage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['study-space-messages', data.space_id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Reply to a message
  const replyToMessage = useMutation({
    mutationFn: async ({ 
      spaceId, 
      replyToId, 
      content 
    }: { 
      spaceId: string; 
      replyToId: string; 
      content: string;
    }) => {
      if (!userId) throw new Error('No user ID provided');
      const { data, error } = await supabase
        .from('study_space_messages')
        .insert({
          space_id: spaceId,
          reply_to_id: replyToId,
          content,
          user_id: userId,
          message_type: 'text',
        })
        .select()
        .single();

      if (error) throw error;
      return data as StudySpaceMessage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['study-space-messages', data.space_id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    studySpaces,
    userSpaces,
    isLoading: isLoadingSpaces || isLoadingUserSpaces,
    getSpaceMessages,
    createStudySpace,
    joinStudySpace,
    leaveStudySpace,
    sendMessage,
    replyToMessage,
  };
};
