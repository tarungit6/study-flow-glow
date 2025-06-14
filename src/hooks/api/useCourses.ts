import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];
type CourseInsert = Database['public']['Tables']['courses']['Insert'];

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log('Fetching courses...');
      
      // First, let's check all courses regardless of published status
      const { data: allCoursesData, error: allCoursesError } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles(full_name),
          enrollments(id, status),
          course_modules(
            id,
            title,
            order_index,
            course_lessons(id, title)
          )
        `)
        .order('created_at', { ascending: false });

      console.log('All courses in database:', allCoursesData);
      console.log('All courses error:', allCoursesError);

      // Now get only published courses
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles(full_name),
          enrollments(id, status),
          course_modules(
            id,
            title,
            order_index,
            course_lessons(id, title)
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      console.log('Published courses:', data);
      console.log('Published courses error:', error);

      if (error) throw error;
      return data;
    },
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles(full_name),
          course_modules(
            *,
            course_lessons(*)
          )
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useEnrollments = () => {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(
            id,
            title,
            description,
            cover_image_url,
            instructor:profiles(full_name)
          )
        `)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
