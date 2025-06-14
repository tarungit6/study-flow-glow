
import React from 'react';
import { Link } from 'react-router-dom';
import { useEnrollments } from '@/hooks/api/useCourses';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

// Mapping difficulty to badge colors, assuming a similar structure as before
const difficultyBadgeColors = (difficulty: string | null | undefined) => {
  switch (difficulty?.toLowerCase()) {
    case 'hard':
      return 'text-red-600 dark:text-red-300';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-300';
    case 'easy':
      return 'text-green-600 dark:text-green-300';
    default:
      return 'text-gray-600 dark:text-gray-300';
  }
};

// Mapping course category to a color, simple hashing for variety
const categoryColors = (category: string | null | undefined) => {
  if (!category) return 'bg-gray-100 dark:bg-gray-800';
  const hash = category.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const colors = [
    'bg-blue-100 dark:bg-blue-900',
    'bg-purple-100 dark:bg-purple-900',
    'bg-green-100 dark:bg-green-900',
    'bg-pink-100 dark:bg-pink-900',
    'bg-yellow-100 dark:bg-yellow-800',
    'bg-indigo-100 dark:bg-indigo-900',
  ];
  return colors[Math.abs(hash) % colors.length];
};


export default function Courses() {
  const { data: enrollments, isLoading, error } = useEnrollments();

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl shadow p-5 bg-gray-100 dark:bg-gray-800 flex flex-col gap-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-9 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load courses: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const courses = enrollments?.map(enrollment => ({
    id: enrollment.course.id,
    title: enrollment.course.title,
    // Assuming instructor is an object with full_name, or just a string
    instructor: typeof enrollment.course.instructor === 'object' 
                  ? enrollment.course.instructor?.full_name || 'N/A' 
                  : enrollment.course.instructor || 'N/A',
    progress: enrollment.progress_percentage ? Number(enrollment.progress_percentage) : 0,
    color: categoryColors(enrollment.course.category), // Use category from course data
    badge: enrollment.course.difficulty_level || 'Medium', // Use difficulty_level
  })) || [];

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition">Back to Home</Link>
      </div>
      {courses.length === 0 && !isLoading ? (
         <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>No Courses Found</AlertTitle>
            <AlertDescription>
              You are not enrolled in any courses yet. Explore available courses to get started!
            </AlertDescription>
          </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className={`rounded-xl shadow p-5 ${course.color} flex flex-col gap-2`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-gray-900 dark:text-white">{course.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full bg-white/80 dark:bg-black/20 font-medium ${difficultyBadgeColors(course.badge)}`}>
                  {course.badge}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-200 mb-2">Instructor: {course.instructor}</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">Progress: {course.progress}%</div>
              {/* TODO: Link to actual course page */}
              <Link to={`/courses/${course.id}`} className="mt-2 text-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm">
                Go to Course
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
