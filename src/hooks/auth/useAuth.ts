import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
    enabled: !!session,
  });

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      navigate('/dashboard');
      toast.success('Successfully signed in!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signUp = useMutation({
    mutationFn: async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            role: 'student',
          });
        if (profileError) throw profileError;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Account created successfully! Please check your email for verification.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      navigate('/login');
      toast.success('Successfully signed out!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    session,
    user,
    isLoading: isLoadingSession || isLoadingUser,
    signIn,
    signUp,
    signOut,
  };
}; 