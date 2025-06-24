
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, Clock, PlayCircle } from 'lucide-react';

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
  const completionPercentage = Math.round((completedLessons.length / lessons.length) * 100);

  return (
    <div className="space-y-4 p-4">
      {/* Progress Overview */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Course Progress
          </span>
          <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
            {completionPercentage}%
          </span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
        <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          {completedLessons.length} of {lessons.length} lessons completed
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = currentLessonId === lesson.id;
          
          return (
            <div
              key={lesson.id}
              className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer border-2 ${
                isCurrent 
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 shadow-md' 
                  : isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 hover:shadow-md'
                  : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:shadow-md'
              }`}
              onClick={() => onLessonSelect(lesson)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <PlayCircle className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Lesson {lesson.order_index}
                    </span>
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                        Now Playing
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </h4>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                    {lesson.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{lesson.duration_minutes} min</span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-3 text-xs"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
