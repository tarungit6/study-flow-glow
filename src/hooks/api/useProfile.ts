import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      if (!userId) throw new Error('No user ID provided');
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', userId], data);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateAvatar = useMutation({
    mutationFn: async (file: File) => {
      if (!userId) throw new Error('No user ID provided');
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return publicUrl;
    },
    onSuccess: (avatarUrl) => {
      queryClient.setQueryData(['profile', userId], (old: Profile | null) => 
        old ? { ...old, avatar_url: avatarUrl } : null
      );
      toast.success('Avatar updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    profile,
    isLoading,
    updateProfile,
    updateAvatar,
  };
}; 