
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
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, User, BookOpen, Clock, Star, ChevronDown, Trophy, Target } from 'lucide-react';

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
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(true);

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

  const currentLessonIndex = lessons?.findIndex(l => l.id === currentLesson?.id) ?? 0;
  const progressPercentage = lessons ? Math.round((completedLessons.length / lessons.length) * 100) : 0;

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {courseError?.message || 'Course not found'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild className="rounded-xl">
              <Link to="/courses" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{course.title}</h1>
          </div>
          
          <Alert className="max-w-2xl mx-auto">
            <BookOpen className="h-4 w-4" />
            <AlertTitle>No Lessons Available</AlertTitle>
            <AlertDescription>
              This course doesn't have any lessons yet. Please check back later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header with Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild className="rounded-xl shadow-sm">
              <Link to="/courses" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Courses</span>
              </Link>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                {course.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                {course.instructor && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="truncate">{course.instructor.full_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Progress Summary */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-amber-500" />
                <div className="text-sm">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Lesson {currentLessonIndex + 1} of {lessons.length}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {progressPercentage}% Complete
                  </div>
                </div>
                <div className="w-16">
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Video Player - Centered and Larger */}
          <div className="xl:col-span-3 space-y-6">
            {currentLesson && (
              <div className="relative">
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
              </div>
            )}
            
            {/* About Course - Better Visual Grouping */}
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  About This Course
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {course.description || 'Expand your knowledge with this comprehensive course designed to help you master new skills and concepts.'}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {course.subject && (
                    <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Subject</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{course.subject}</div>
                    </div>
                  )}
                  {course.grade_level && (
                    <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Grade Level</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{course.grade_level}</div>
                    </div>
                  )}
                  <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Progress</div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">{progressPercentage}%</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">Duration</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      {lessons.reduce((total, lesson) => total + lesson.duration_minutes, 0)} min
                    </div>
                  </div>
                </div>

                {course.difficulty && (
                  <div className="flex items-center justify-center">
                    <Badge variant="secondary" className="px-4 py-2 text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      {course.difficulty}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Collapsible Lesson Playlist */}
          <div className="xl:col-span-1">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl sticky top-6">
              <Collapsible open={isPlaylistOpen} onOpenChange={setIsPlaylistOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors rounded-t-xl">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Course Lessons
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isPlaylistOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {completedLessons.length} of {lessons.length} completed
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="p-0">
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
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
