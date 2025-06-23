
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Clock } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  order_index: number;
}

interface LessonPlaylistProps {
  lessons: Lesson[];
  currentLessonId?: string;
  onLessonSelect: (lesson: Lesson) => void;
  completedLessons: string[];
}

export function LessonPlaylist({ 
  lessons, 
  currentLessonId, 
  onLessonSelect, 
  completedLessons 
}: LessonPlaylistProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Course Lessons
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {completedLessons.length} of {lessons.length} completed
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = currentLessonId === lesson.id;
          
          return (
            <div
              key={lesson.id}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                isCurrent 
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' 
                  : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80'
              }`}
              onClick={() => onLessonSelect(lesson)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Lesson {lesson.order_index}
                    </span>
                    {isCompleted && (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        Playing
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">
                    {lesson.title}
                  </h4>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {lesson.description}
                  </p>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{lesson.duration_minutes} min</span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
