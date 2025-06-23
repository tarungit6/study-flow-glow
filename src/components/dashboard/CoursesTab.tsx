
import React from 'react';
import { Link } from 'react-router-dom';
import { useEnrollments } from '@/hooks/api/useCourses';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, User, Clock, Star, ArrowRight, Play, GraduationCap } from 'lucide-react';
import type { Enrollment } from '@/types/course';
import type { Course } from '@/types/course';

const difficultyColors = {
  'easy': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'medium': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'hard': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800',
} as const;

export function CoursesTab() {
  const { data: enrollments, isLoading } = useEnrollments();

  const validEnrollments = React.useMemo(() => {
    if (!enrollments) return [] as Enrollment[];
    return enrollments.filter(e => e.content) as unknown as Enrollment[];
  }, [enrollments]);

  const totalEnrolled = validEnrollments.length;
  const easyCourses = validEnrollments.filter(e => e.content?.difficulty?.toLowerCase() === 'easy').length;
  const hardCourses = validEnrollments.filter(e => e.content?.difficulty?.toLowerCase() === 'hard').length;

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-2 w-full" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalEnrolled}</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Beginner Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{easyCourses}</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-xl bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Advanced Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">{hardCourses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Cards */}
      {validEnrollments.length === 0 ? (
        <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">No Enrolled Courses</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Start your learning journey today!
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white rounded-xl shadow-lg">
              <Link to="/browse-courses">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {validEnrollments.map((enrollment) => {
            const content = enrollment.content as Course;
            if (!content) return null;

            const progress = typeof enrollment.progress_percentage === 'number' ? enrollment.progress_percentage : 0;

            return (
              <Card key={enrollment.id} className="group border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {content.title}
                    </CardTitle>
                    {content.difficulty && (
                      <Badge 
                        className={`shrink-0 rounded-full border ${difficultyColors[content.difficulty.toLowerCase() as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                      >
                        {content.difficulty}
                      </Badge>
                    )}
                  </div>
                  {content.instructor && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{content.instructor.full_name}</span>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-3">
                    {content.description || 'Expand your knowledge with this comprehensive course.'}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {content.subject && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{content.subject}</span>
                      </div>
                    )}
                    {content.content_type && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{content.content_type}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                    <Link 
                      to={`/course/${content.id}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Continue Learning</span>
                    </Link>
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
