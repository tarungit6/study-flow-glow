
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Quiz = Database['public']['Tables']['quiz_definitions']['Row'];
type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];

export const useQuizzes = (courseId?: string) => {
  return useQuery({
    queryKey: ['quizzes', courseId],
    queryFn: async () => {
      let query = supabase
        .from('quiz_definitions')
        .select(`
          *,
          course:courses(title),
          quiz_questions(*),
          quiz_attempts(id, score, passed)
        `)
        .eq('status', 'published');

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useQuiz = (quizId: string) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_definitions')
        .select(`
          *,
          quiz_questions(*),
          quiz_attempts(*)
        `)
        .eq('id', quizId)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useQuizAttempts = (quizId?: string) => {
  return useQuery({
    queryKey: ['quiz-attempts', quizId],
    queryFn: async () => {
      let query = supabase
        .from('quiz_attempts')
        .select(`
          *,
          quiz:quiz_definitions(title)
        `);

      if (quizId) {
        query = query.eq('quiz_id', quizId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useStartQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      // Get current attempt count
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('attempt_number')
        .eq('quiz_id', quizId)
        .order('attempt_number', { ascending: false })
        .limit(1);

      const nextAttemptNumber = (attempts?.[0]?.attempt_number || 0) + 1;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          attempt_number: nextAttemptNumber,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
    },
  });
};

export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      attemptId, 
      answers, 
      score, 
      maxScore, 
      timeTaken 
    }: { 
      attemptId: string; 
      answers: any; 
      score: number; 
      maxScore: number; 
      timeTaken: number;
    }) => {
      const passed = (score / maxScore) * 100 >= 70; // Assuming 70% passing score

      const { data, error } = await supabase
        .from('quiz_attempts')
        .update({
          completed_at: new Date().toISOString(),
          answers,
          score,
          max_score: maxScore,
          passed,
          time_taken_minutes: timeTaken,
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
    },
  });
};
