import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Assignment = Database['public']['Tables']['assignments']['Row'];
type AssignmentInsert = Database['public']['Tables']['assignments']['Insert'];
type AssignmentUpdate = Database['public']['Tables']['assignments']['Update'];
type AssignmentSubmission = Database['public']['Tables']['assignment_submissions']['Row'];
type AssignmentSubmissionInsert = Database['public']['Tables']['assignment_submissions']['Insert'];

export const useAssignments = (userId?: string) => {
  const queryClient = useQueryClient();

  // Get all assignments
  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          course:courses(title),
          created_by_user:profiles!assignments_created_by_fkey(full_name, avatar_url),
          submissions:assignment_submissions(
            id,
            assignment_id,
            user_id,
            content,
            file_urls,
            status,
            submitted_at,
            grade,
            feedback,
            graded_at,
            graded_by
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as unknown as (Assignment & {
        course: { title: string } | null;
        created_by_user: { full_name: string; avatar_url: string | null };
        submissions: AssignmentSubmission[];
      })[];
    },
  });

  // Get user's assignments (with submissions)
  const { data: userAssignments, isLoading: isLoadingUserAssignments } = useQuery({
    queryKey: ['user-assignments', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          course:courses(title),
          created_by_user:profiles!assignments_created_by_fkey(full_name, avatar_url),
          submissions:assignment_submissions!assignment_submissions_assignment_id_fkey(
            *,
            graded_by:profiles!assignment_submissions_graded_by_fkey(full_name, avatar_url)
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as (Assignment & {
        course: { title: string } | null;
        created_by_user: { full_name: string; avatar_url: string | null };
        submissions: (AssignmentSubmission & {
          graded_by: { full_name: string; avatar_url: string | null } | null;
        })[];
      })[];
    },
    enabled: !!userId,
  });

  // Create a new assignment
  const createAssignment = useMutation({
    mutationFn: async (assignment: Omit<AssignmentInsert, 'created_by'>) => {
      if (!userId) throw new Error('No user ID provided');
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          ...assignment,
          created_by: userId,
          status: 'published',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] });
      toast.success('Assignment created successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Submit an assignment
  const submitAssignment = useMutation({
    mutationFn: async ({ 
      assignmentId, 
      content, 
      fileUrls 
    }: { 
      assignmentId: string; 
      content: string; 
      fileUrls?: string[];
    }) => {
      if (!userId) throw new Error('No user ID provided');
      const { data, error } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: assignmentId,
          user_id: userId,
          content,
          file_urls: fileUrls,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        } as AssignmentSubmissionInsert)
        .select()
        .single();

      if (error) throw error;

      // Add XP for submitting assignment
      await supabase.from('xp_transactions').insert({
        user_id: userId,
        amount: 50, // 50 XP for submitting an assignment
        reason: 'Assignment submitted',
        reference_id: data.id,
        reference_type: 'assignment_submission',
      });

      return data as AssignmentSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['user-xp'] });
      toast.success('Assignment submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Grade an assignment (for instructors)
  const gradeAssignment = useMutation({
    mutationFn: async ({ 
      submissionId, 
      grade, 
      feedback 
    }: { 
      submissionId: string; 
      grade: number; 
      feedback?: string;
    }) => {
      if (!userId) throw new Error('No user ID provided');
      const { data, error } = await supabase
        .from('assignment_submissions')
        .update({
          grade,
          feedback,
          graded_by: userId,
          graded_at: new Date().toISOString(),
          status: 'graded',
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;

      // Get the submission to find the user
      const { data: submission } = await supabase
        .from('assignment_submissions')
        .select('user_id, assignment:assignments(max_points)')
        .eq('id', submissionId)
        .single();

      if (submission) {
        // Calculate XP based on grade percentage
        const maxPoints = submission.assignment.max_points || 100;
        const gradePercentage = (grade / maxPoints) * 100;
        const xpAmount = Math.round(gradePercentage * 2); // 2 XP per percentage point

        // Add XP for graded assignment
        await supabase.from('xp_transactions').insert({
          user_id: submission.user_id,
          amount: xpAmount,
          reason: 'Assignment graded',
          reference_id: submissionId,
          reference_type: 'assignment_submission',
        });

        // Check for high grade achievement
        if (gradePercentage >= 90) {
          const { data: achievement } = await supabase
            .from('achievements')
            .select('id')
            .eq('achievement_type', 'participation')
            .single();

          if (achievement) {
            await supabase.from('user_achievements').insert({
              user_id: submission.user_id,
              achievement_id: achievement.id,
              earned_at: new Date().toISOString(),
            });
          }
        }
      }

      return data as AssignmentSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['user-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['user-xp'] });
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      toast.success('Assignment graded successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    assignments,
    userAssignments,
    isLoading: isLoadingAssignments || isLoadingUserAssignments,
    createAssignment,
    submitAssignment,
    gradeAssignment,
  };
}; 