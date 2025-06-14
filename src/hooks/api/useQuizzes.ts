import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Quiz = Database['public']['Tables']['quiz_definitions']['Row'];
type QuizInsert = Database['public']['Tables']['quiz_definitions']['Insert'];
type QuizUpdate = Database['public']['Tables']['quiz_definitions']['Update'];
type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row'];
type QuizQuestionInsert = Database['public']['Tables']['quiz_questions']['Insert'];
type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];
type QuizAttemptInsert = Database['public']['Tables']['quiz_attempts']['Insert'];

export const useQuizzes = (userId?: string) => {
  const queryClient = useQueryClient();

  // Get all quizzes
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_definitions')
        .select(`
          *,
          course:courses(title),
          created_by_user:profiles!quiz_definitions_created_by_fkey(full_name, avatar_url),
          questions:quiz_questions(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (Quiz & {
        course: { title: string } | null;
        created_by_user: { full_name: string; avatar_url: string | null };
        questions: QuizQuestion[];
      })[];
    },
  });

  // Get user's quiz attempts
  const { data: quizAttempts, isLoading: isLoadingAttempts } = useQuery({
    queryKey: ['quiz-attempts', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quiz:quiz_definitions(
            title,
            course:courses(title)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (QuizAttempt & {
        quiz: {
          title: string;
          course: { title: string } | null;
        };
      })[];
    },
    enabled: !!userId,
  });

  // Create a new quiz
  const createQuiz = useMutation({
    mutationFn: async ({
      quiz,
      questions
    }: {
      quiz: Omit<QuizInsert, 'created_by'>;
      questions: Omit<QuizQuestionInsert, 'quiz_id'>[];
    }) => {
      if (!userId) throw new Error('No user ID provided');

      // Start a transaction
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_definitions')
        .insert({
          ...quiz,
          created_by: userId,
        })
        .select()
        .single();

      if (quizError) throw quizError;
      if (!quizData) throw new Error('Quiz creation failed, no data returned.');

      // Insert questions
      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(
          questions.map((q, index) => ({
            ...q,
            quiz_id: quizData.id,
            order_index: index,
          }))
        );

      if (questionsError) {
        // Optional: Attempt to delete the created quiz definition if questions fail
        // await supabase.from('quiz_definitions').delete().match({ id: quizData.id });
        throw questionsError;
      }

      return quizData as Quiz;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz created successfully!');
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    },
  });

  // Start a quiz attempt
  const startQuizAttempt = useMutation({
    mutationFn: async (quizId: string) => {
      if (!userId) throw new Error('No user ID provided');

      // Get the latest attempt number
      const { data: latestAttempt } = await supabase
        .from('quiz_attempts')
        .select('attempt_number')
        .eq('quiz_id', quizId)
        .eq('user_id', userId)
        .order('attempt_number', { ascending: false })
        .limit(1)
        .single();

      const attemptNumber = (latestAttempt?.attempt_number || 0) + 1;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: userId,
          attempt_number: attemptNumber,
          started_at: new Date().toISOString(),
          answers: {},
        } as QuizAttemptInsert)
        .select()
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Submit quiz answers
  const submitQuizAnswers = useMutation({
    mutationFn: async ({ 
      attemptId, 
      answers 
    }: { 
      attemptId: string; 
      answers: Record<string, string>;
    }) => {
      // Get the quiz attempt and questions
      const { data: attempt, error: attemptError } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quiz:quiz_definitions(
            questions:quiz_questions(*)
          )
        `)
        .eq('id', attemptId)
        .single();

      if (attemptError) throw attemptError;

      // Calculate score
      let score = 0;
      let maxScore = 0;
      const questions = attempt.quiz.questions as QuizQuestion[];

      questions.forEach((question) => {
        maxScore += question.points || 1;
        if (answers[question.id] === question.correct_answer) {
          score += question.points || 1;
        }
      });

      const passed = (score / maxScore) >= 0.7; // 70% to pass

      // Update attempt
      const { data, error } = await supabase
        .from('quiz_attempts')
        .update({
          answers,
          score,
          max_score: maxScore,
          passed,
          completed_at: new Date().toISOString(),
          time_taken_minutes: Math.round(
            (new Date().getTime() - new Date(attempt.started_at!).getTime()) / (1000 * 60)
          ),
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw error;

      // Award XP and achievements if passed
      if (passed && userId) {
        // Add XP for passing quiz
        await supabase.from('xp_transactions').insert({
          user_id: userId,
          amount: Math.round(score * 10), // 10 XP per point
          reason: 'Quiz completed',
          reference_id: attemptId,
          reference_type: 'quiz_attempt',
        });

        // Check for high score achievement
        if (score / maxScore >= 0.9) { // 90% or higher
          const { data: achievement } = await supabase
            .from('achievements')
            .select('id')
            .eq('achievement_type', 'quiz_score')
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

      return data as QuizAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['user-xp'] });
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      toast.success('Quiz submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    quizzes,
    quizAttempts,
    isLoading: isLoadingQuizzes || isLoadingAttempts,
    createQuiz,
    startQuizAttempt,
    submitQuizAnswers,
  };
};
