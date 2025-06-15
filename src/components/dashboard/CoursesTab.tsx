
import React from 'react';
import { Link } from 'react-router-dom';
import { useEnrollments } from '@/hooks/api/useCourses';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User, Clock, Star, ArrowRight, ExternalLink } from 'lucide-react';
import type { Enrollment } from '@/types/course';

const difficultyColors = {
  'easy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'hard': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
} as const;

export function CoursesTab() {
  const { data: enrollments, isLoading } = useEnrollments();

  // Filter out enrollments with null course data and cast to Enrollment type
  const validEnrollments = React.useMemo(() => {
    if (!enrollments) return [] as Enrollment[];
    return enrollments.filter(e => e.course) as unknown as Enrollment[];
  }, [enrollments]);

  // Get counts for overview
  const totalEnrolled = validEnrollments.length;
  const easyCourses = validEnrollments.filter(e => e.course?.difficulty?.toLowerCase() === 'easy').length;
  const hardCourses = validEnrollments.filter(e => e.course?.difficulty?.toLowerCase() === 'hard').length;

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrolled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Easy Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{easyCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Advanced Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hardCourses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Cards */}
      {validEnrollments.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No Enrolled Courses</h3>
          <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/browse-courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validEnrollments.map((enrollment) => {
            const course = enrollment.course;
            if (!course) return null;

            return (
              <Card key={enrollment.id} className="flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    {course.difficulty && (
                      <Badge 
                        className={`shrink-0 ${difficultyColors[course.difficulty.toLowerCase() as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {course.difficulty}
                      </Badge>
                    )}
                  </div>
                  {course.instructor && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{course.instructor.full_name}</span>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="flex-1">
                  <CardDescription className="line-clamp-3 mb-4">
                    {course.description || 'No description available.'}
                  </CardDescription>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {course.subject && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{course.subject}</span>
                      </div>
                    )}
                    {course.content_type && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.content_type}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <a 
                      href={course.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span>Continue Learning</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
