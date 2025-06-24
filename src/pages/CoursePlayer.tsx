
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
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  Clock, 
  Star, 
  ChevronDown, 
  Trophy, 
  Target,
  Flame,
  Award,
  Calendar,
  BarChart3,
  PanelRightClose,
  PanelRightOpen,
  GraduationCap,
  Zap
} from 'lucide-react';

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
  const [isTheaterMode, setIsTheaterMode] = useState(false);

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
  const totalDuration = lessons ? lessons.reduce((total, lesson) => total + lesson.duration_minutes, 0) : 0;
  const completedDuration = lessons ? lessons.filter(l => completedLessons.includes(l.id)).reduce((total, lesson) => total + lesson.duration_minutes, 0) : 0;

  // Gamification calculations
  const streak = 3; // Mock streak data
  const xpEarned = completedLessons.length * 50;
  const nextMilestone = Math.ceil(lessons?.length || 0 / 2) * 50;

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Skeleton className="h-2 w-full" />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-6">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild className="rounded-xl border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to="/courses" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
          </div>
          
          <Alert className="max-w-2xl mx-auto bg-slate-800 border-slate-700">
            <BookOpen className="h-4 w-4" />
            <AlertTitle className="text-slate-200">No Lessons Available</AlertTitle>
            <AlertDescription className="text-slate-400">
              This course doesn't have any lessons yet. Please check back later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Top Progress Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="text-slate-300 hover:bg-slate-800 rounded-xl">
                <Link to="/courses" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Courses</span>
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-bold text-white truncate">{course.title}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>Lesson {currentLessonIndex + 1} of {lessons.length}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{completedDuration}m / {totalDuration}m</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gamification Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-300">{streak} day streak</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30">
                <Zap className="h-4 w-4 text-teal-400" />
                <span className="text-sm font-semibold text-teal-300">{xpEarned} XP</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className="text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                {isTheaterMode ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
                <span className="ml-2 hidden lg:inline">Theater</span>
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <Progress value={progressPercentage} className="h-2 bg-slate-800" />
            <div className="absolute -top-1 left-0 right-0 flex justify-between">
              <div className="w-2 h-4 bg-teal-500 rounded-full"></div>
              <div className={`w-2 h-4 rounded-full ${progressPercentage >= 50 ? 'bg-teal-500' : 'bg-slate-600'}`}></div>
              <div className={`w-2 h-4 rounded-full ${progressPercentage >= 100 ? 'bg-teal-500' : 'bg-slate-600'}`}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">{progressPercentage}% Complete</span>
            <span className="text-xs text-slate-400">Next milestone: {nextMilestone} XP</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className={`grid gap-6 transition-all duration-300 ${isTheaterMode ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-4'}`}>
          {/* Video Player */}
          <div className={`space-y-6 ${isTheaterMode ? 'col-span-full' : 'xl:col-span-3'}`}>
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
            
            {/* About Course - Enhanced */}
            {!isTheaterMode && (
              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20">
                      <GraduationCap className="h-5 w-5 text-teal-400" />
                    </div>
                    About This Course
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {course.description || 'Expand your knowledge with this comprehensive course designed to help you master new skills and concepts.'}
                  </p>
                  
                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {course.subject && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-300">Subject</span>
                        </div>
                        <div className="text-white font-semibold">{course.subject}</div>
                      </div>
                    )}
                    
                    {course.grade_level && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-300">Level</span>
                        </div>
                        <div className="text-white font-semibold">{course.grade_level}</div>
                      </div>
                    )}
                    
                    <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-orange-400" />
                        <span className="text-sm font-medium text-orange-300">Progress</span>
                      </div>
                      <div className="text-white font-semibold">{progressPercentage}%</div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-teal-400" />
                        <span className="text-sm font-medium text-teal-300">Duration</span>
                      </div>
                      <div className="text-white font-semibold">{totalDuration}min</div>
                    </div>
                  </div>

                  {/* Achievement Badges */}
                  <div className="flex flex-wrap gap-3">
                    <Badge className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      {course.difficulty_level || 'Beginner'}
                    </Badge>
                    <Badge className="px-4 py-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/30 text-white">
                      <Trophy className="h-3 w-3 mr-1" />
                      {lessons.length} Lessons
                    </Badge>
                    {course.instructor && (
                      <Badge className="px-4 py-2 bg-gradient-to-r from-slate-500/20 to-slate-600/20 border-slate-500/30 text-white">
                        <User className="h-3 w-3 mr-1" />
                        {course.instructor.full_name}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Collapsible Lesson Playlist */}
          {!isTheaterMode && (
            <div className="xl:col-span-1">
              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 sticky top-32">
                <Collapsible open={isPlaylistOpen} onOpenChange={setIsPlaylistOpen}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-slate-700/30 transition-colors rounded-t-xl">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20">
                            <Target className="h-4 w-4 text-teal-400" />
                          </div>
                          Course Lessons
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isPlaylistOpen ? 'rotate-180' : ''}`} />
                      </CardTitle>
                      <div className="text-sm text-slate-400 ml-11">
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
          )}

          {/* Theater Mode Overlay Playlist */}
          {isTheaterMode && (
            <div className="fixed right-6 top-32 w-80 z-40">
              <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-700/30 transition-colors rounded-t-xl pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-teal-400" />
                        Lessons
                      </div>
                      <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                        {completedLessons.length}/{lessons.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CardContent className="p-0 max-h-96 overflow-y-auto">
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
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
