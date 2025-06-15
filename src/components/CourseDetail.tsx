
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourse } from '@/hooks/api/useCourses';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal, ArrowLeft, User, BookOpen, Clock, ExternalLink } from 'lucide-react';

const difficultyColors = {
  'easy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'hard': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
} as const;

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading, error } = useCourse(id!);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Course not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/browse-courses" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Course Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
              {course.instructor && (
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  <span>Instructor: {course.instructor.full_name}</span>
                </div>
              )}
            </div>
            {course.difficulty && (
              <Badge 
                className={difficultyColors[course.difficulty.toLowerCase() as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'}
              >
                {course.difficulty}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <CardDescription className="text-base leading-relaxed">
            {course.description || 'No description available.'}
          </CardDescription>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {course.subject && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Subject:</strong> {course.subject}
                </span>
              </div>
            )}
            {course.content_type && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Type:</strong> {course.content_type}
                </span>
              </div>
            )}
            {course.grade_level && (
              <div className="text-sm">
                <strong>Grade Level:</strong> {course.grade_level}
              </div>
            )}
          </div>

          {course.concepts && course.concepts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Key Concepts:</h3>
              <div className="flex flex-wrap gap-2">
                {course.concepts.map((concept, index) => (
                  <Badge key={index} variant="secondary">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {course.url && (
            <div className="pt-4">
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <a 
                  href={course.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span>Start Learning</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
