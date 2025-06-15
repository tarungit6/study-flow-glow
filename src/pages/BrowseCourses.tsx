
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCourses, useEnrollInCourse, useEnrollments } from '@/hooks/api/useCourses';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal, Search, BookOpen, User, Clock, Star, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Course } from '@/types/course';

const difficultyColors = {
  'easy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'hard': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
} as const;

type DifficultyLevel = keyof typeof difficultyColors;

export default function BrowseCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  const { data: allCourses, isLoading, error } = useCourses();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const enrollInCourse = useEnrollInCourse();

  // Get enrolled course IDs from server data
  const serverEnrolledCourseIds = useMemo(() => {
    if (!enrollments) return new Set<string>();
    return new Set(enrollments.map(e => e.course_id));
  }, [enrollments]);

  // Combine server enrollments with local state
  const allEnrolledCourseIds = useMemo(() => {
    const combined = new Set([...serverEnrolledCourseIds, ...enrolledCourses]);
    return combined;
  }, [serverEnrolledCourseIds, enrolledCourses]);

  // Filter available courses (not enrolled, published)
  const availableCourses = useMemo(() => {
    if (!allCourses) return [] as Course[];
    return allCourses.filter(course => 
      course.is_published && !allEnrolledCourseIds.has(course.id)
    ) as Course[];
  }, [allCourses, allEnrolledCourseIds]);

  // Get unique categories and difficulties
  const categories = useMemo(() => {
    const cats = new Set(availableCourses.map(c => c.subject).filter(Boolean));
    return Array.from(cats);
  }, [availableCourses]);

  const difficulties = useMemo(() => {
    const diffs = new Set(availableCourses.map(c => c.difficulty).filter(Boolean));
    return Array.from(diffs);
  }, [availableCourses]);

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return availableCourses.filter(course => {
      const matchesSearch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || course.subject === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [availableCourses, searchTerm, categoryFilter, difficultyFilter]);

  const handleEnroll = async (courseId: string, courseTitle: string) => {
    try {
      // Check if already enrolled
      if (allEnrolledCourseIds.has(courseId)) {
        toast.error('You are already enrolled in this course');
        return;
      }

      await enrollInCourse.mutateAsync(courseId);
      
      // Update local state immediately for UI responsiveness
      setEnrolledCourses(prev => new Set([...prev, courseId]));
      
      toast.success(`Successfully enrolled in ${courseTitle}!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll in course. Please try again.');
    }
  };

  if (isLoading || enrollmentsLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>

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

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Browse Courses</h1>
          <p className="text-muted-foreground">Discover new courses and expand your knowledge</p>
          <p className="text-xs text-muted-foreground mt-1">
            Available: {availableCourses.length} | Enrolled: {allEnrolledCourseIds.size}
          </p>
        </div>
        <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition">
          Back to Home
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, instructors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Alert>
          <BookOpen className="h-4 w-4" />
          <AlertTitle>No Courses Available</AlertTitle>
          <AlertDescription>
            {searchTerm || categoryFilter !== 'all' || difficultyFilter !== 'all' 
              ? 'Try adjusting your search criteria or filters to find more courses.'
              : 'There are no courses available for enrollment at the moment. Check back later for new content!'
            }
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = allEnrolledCourseIds.has(course.id);
            const isEnrolling = enrollInCourse.isPending;
            
            return (
              <Card key={course.id} className="flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    {course.difficulty && (
                      <Badge 
                        className={`shrink-0 ${difficultyColors[course.difficulty.toLowerCase() as DifficultyLevel] || 'bg-gray-100 text-gray-800'}`}
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
                  <Button 
                    className={`w-full ${isEnrolled ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} transition-colors`}
                    onClick={() => !isEnrolled && handleEnroll(course.id, course.title)}
                    disabled={isEnrolling || isEnrolled}
                  >
                    {isEnrolled ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Enrolled</span>
                      </div>
                    ) : isEnrolling ? (
                      'Enrolling...'
                    ) : (
                      'Enroll Now'
                    )}
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
