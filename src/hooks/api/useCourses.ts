
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log('Fetching educational content...');
      
      const { data, error } = await supabase
        .from('educational_content')
        .select(`
          *,
          instructor:profiles(full_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      console.log('Published educational content:', data);
      console.log('Error:', error);

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
        .from('educational_content')
        .select(`
          *,
          instructor:profiles(full_name)
        `)
        .eq('id', courseId)
        .maybeSingle();

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
        .select(`*, course_id`) // Only fetch enrollments now
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      // Now manually fetch all related courses
      const courseIds = data.map(e => e.course_id);

      const { data: courses, error: courseError } = await supabase
        .from('educational_content')
        .select('*, instructor:profiles(full_name)')
        .in('id', courseIds);

      if (courseError) throw courseError;

      // Join course data manually
      const enrollmentsWithCourse = data.map(enrollment => ({
        ...enrollment,
        content: courses.find(c => c.id === enrollment.course_id),
      }));

      return enrollmentsWithCourse;
    },
  });
};


export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) {
        throw new Error('You must be logged in to enroll in a course');
      }

      console.log('Attempting to enroll in course:', courseId);

      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (existingEnrollment) {
        throw new Error('You are already enrolled in this course');
      }

      // Check if course exists and is published
      const { data: course, error: courseError } = await supabase
        .from('educational_content')
        .select('id, is_published')
        .eq('id', courseId)
        .single();

      if (courseError) {
        console.error('Course lookup error:', courseError);
        throw new Error('Course not found');
      }

      if (!course.is_published) {
        throw new Error('This course is not available for enrollment');
      }

      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          status: 'active',
          enrolled_at: new Date().toISOString(),
          progress_percentage: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Enrollment error:', error);
        throw new Error(error.message || 'Failed to enroll in course');
      }

      console.log('Enrollment successful:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
