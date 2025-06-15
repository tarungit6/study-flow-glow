

import React from 'react';
import { Link } from 'react-router-dom';
import { useEnrollments } from '@/hooks/api/useCourses';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal, BookOpen, User, ExternalLink } from 'lucide-react';

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
  
  // Only keep enrollments with a valid course object (not an error object)
  const courses = enrollments?.filter(e => {
    // Check if course exists, is an object, and has required properties
    return e.course && 
           e.course !== null &&
           typeof e.course === 'object' && 
           'id' in e.course && 
           'title' in e.course &&
           !('message' in e.course); // Exclude error objects
  }).map(enrollment => {
    const course = enrollment.course as any; // Type assertion since we've verified it's valid
    return {
      id: course.id,
      title: course.title,
      instructor: course.instructor?.full_name || 'N/A',
      progress: typeof enrollment.progress_percentage === 'number' ? enrollment.progress_percentage : 0,
      color: categoryColors(course.subject || 'General'),
      badge: course.difficulty || 'Medium',
      url: course.url,
    };
  }) || [];

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition">Back to Home</Link>
      </div>
      {courses.length === 0 && !isLoading ? (
         <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Enrolled Courses</h3>
            <p className="text-muted-foreground mb-4">You are not enrolled in any courses yet. Explore available courses to get started!</p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/browse-courses">Browse Courses</Link>
            </Button>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className={`rounded-xl shadow p-5 ${course.color} flex flex-col gap-2 hover:shadow-xl hover:scale-105 transition-all duration-200`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-gray-900 dark:text-white">{course.title}</span>
                <Badge className={`text-xs px-2 py-1 rounded-full bg-white/80 dark:bg-black/20 font-medium ${difficultyBadgeColors(course.badge)}`}>
                  {course.badge}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-200 mb-2 flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Instructor: {course.instructor}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">Progress: {course.progress}%</div>
              <Button asChild className="mt-2 bg-purple-600 hover:bg-purple-700">
                <a 
                  href={course.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Go to Course</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

