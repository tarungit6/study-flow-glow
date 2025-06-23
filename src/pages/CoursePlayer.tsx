import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourse } from '@/hooks/api/useCourses';
import { useLessons } from '@/hooks/api/useLessons';
import { useProgressLogs } from '@/hooks/api/useProgress';
import { VideoPlayer } from '@/components/course/VideoPlayer';
import { LessonPlaylist } from '@/components/course/LessonPlaylist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, User, BookOpen, Clock, Star } from 'lucide-react';

// Define the lesson type based on the actual database schema
interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
  module_id: string | null;
  created_at: string;
}

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(id!);
  const { data: lessons, isLoading: lessonsLoading } = useLessons(id!);
  const { data: progressLogs } = useProgressLogs();
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  // Set the first lesson as default when lessons load
  useEffect(() => {
    if (lessons && lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons, currentLesson]);

  const completedLessons = React.useMemo(() => {
    if (!progressLogs) return [];
    return progressLogs
      .filter(log => log.completed && log.lesson_id)
      .map(log => log.lesson_id);
  }, [progressLogs]);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleLessonComplete = () => {
    if (!lessons || !currentLesson) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    const nextLesson = lessons[currentIndex + 1];
    
    if (nextLesson) {
      setCurrentLesson(nextLesson);
    }
  };

  if (courseLoading || lessonsLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {courseError?.message || 'Course not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/courses" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>
        
        <Alert>
          <BookOpen className="h-4 w-4" />
          <AlertTitle>No Lessons Available</AlertTitle>
          <AlertDescription>
            This course doesn't have any lessons yet. Please check back later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/courses" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            {course.instructor && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{course.instructor.full_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{lessons.length} lessons</span>
            </div>
            {course.difficulty && (
              <Badge variant="secondary">{course.difficulty}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-6">
          {currentLesson && (
            <VideoPlayer 
              lesson={{
                id: currentLesson.id,
                title: currentLesson.title,
                description: currentLesson.content,
                video_url: currentLesson.video_url,
                duration_minutes: currentLesson.duration_minutes
              }}
              onLessonComplete={handleLessonComplete}
            />
          )}
          
          {/* Course Description */}
          <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>About This Course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {course.description || 'Expand your knowledge with this comprehensive course.'}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {course.subject && (
                  <div className="text-center">
                    <div className="text-sm font-medium">Subject</div>
                    <div className="text-xs text-muted-foreground">{course.subject}</div>
                  </div>
                )}
                {course.grade_level && (
                  <div className="text-center">
                    <div className="text-sm font-medium">Grade Level</div>
                    <div className="text-xs text-muted-foreground">{course.grade_level}</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-sm font-medium">Progress</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((completedLessons.length / lessons.length) * 100)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Total Duration</div>
                  <div className="text-xs text-muted-foreground">
                    {lessons.reduce((total, lesson) => total + lesson.duration_minutes, 0)} min
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Playlist */}
        <div>
          <LessonPlaylist
            lessons={lessons.map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.content,
              duration_minutes: lesson.duration_minutes,
              order_index: lesson.order_index
            }))}
            currentLessonId={currentLesson?.id}
            onLessonSelect={(lesson) => {
              const originalLesson = lessons.find(l => l.id === lesson.id);
              if (originalLesson) {
                setCurrentLesson(originalLesson);
              }
            }}
            completedLessons={completedLessons}
          />
        </div>
      </div>
    </div>
  );
}
