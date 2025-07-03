import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LessonRecommendation {
  lesson_id: string;
  course_id: string;
  similarity: number;
  lesson_title: string;
  lesson_content: string;
  lesson_duration_minutes: number;
  lesson_video_url: string;
  course_title: string;
  course_description: string;
  course_subject: string;
  course_difficulty: string;
  course_grade_level: string;
  instructor_name: string;
}

interface RecommendationFilters {
  match_count?: number;
  match_threshold?: number;
  filter_course_id?: string;
  filter_difficulty?: string;
  filter_grade_level?: string;
}

export const useRecommendations = (query: string, filters?: RecommendationFilters) => {
  return useQuery({
    queryKey: ['recommendations', query, filters],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const { data, error } = await supabase.functions.invoke('get-recommendations', {
        body: {
          query,
          ...filters,
        },
      });

      if (error) throw error;
      return data.recommendations as LessonRecommendation[];
    },
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGenerateEmbedding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lesson_id, course_id, text }: { 
      lesson_id: string; 
      course_id: string; 
      text: string 
    }) => {
      const { data, error } = await supabase.functions.invoke('generate-embeddings', {
        body: {
          lesson_id,
          course_id,
          text,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate recommendations queries when new embeddings are generated
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};