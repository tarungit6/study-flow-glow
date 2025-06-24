
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, Clock, PlayCircle, Zap } from 'lucide-react';

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

  // Duration color coding
  const getDurationColor = (duration: number) => {
    if (duration <= 5) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (duration <= 15) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };

  return (
    <div className="space-y-4 p-4">
      {/* Enhanced Progress Overview */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20">
              <Zap className="h-4 w-4 text-teal-400" />
            </div>
            <span className="font-semibold text-teal-100">Your Progress</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{completionPercentage}%</div>
            <div className="text-xs text-teal-300">Complete</div>
          </div>
        </div>
        
        <div className="relative mb-3">
          <Progress value={completionPercentage} className="h-3 bg-slate-800/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full" 
               style={{ width: `${completionPercentage}%` }} />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">{completedLessons.length} of {lessons.length} lessons</span>
          <div className="flex items-center gap-1 text-teal-300">
            <CheckCircle className="h-3 w-3" />
            <span>Keep going!</span>
          </div>
        </div>
      </div>

      {/* Enhanced Lessons List */}
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = currentLessonId === lesson.id;
          
          return (
            <div
              key={lesson.id}
              className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer border-2 transform hover:scale-[1.02] ${
                isCurrent 
                  ? 'bg-gradient-to-br from-teal-500/20 via-cyan-500/15 to-blue-500/10 border-teal-400/50 shadow-lg shadow-teal-500/10' 
                  : isCompleted
                  ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/10'
                  : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600/50 hover:shadow-md'
              }`}
              onClick={() => onLessonSelect(lesson)}
            >
              <div className="flex items-start gap-3">
                {/* Enhanced Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg animate-pulse">
                      <PlayCircle className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center border border-slate-500/30">
                      <span className="text-sm font-bold text-slate-300">
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Lesson Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-400">
                      Lesson {lesson.order_index}
                    </span>
                    {isCurrent && (
                      <Badge className="text-xs px-2 py-0.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/30 text-teal-200">
                        Now Playing
                      </Badge>
                    )}
                    {isCompleted && !isCurrent && (
                      <Badge className="text-xs px-2 py-0.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-200">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                  
                  {/* Enhanced Title */}
                  <h4 className={`font-bold text-base mb-2 line-clamp-2 transition-colors ${
                    isCurrent 
                      ? 'text-white' 
                      : isCompleted 
                      ? 'text-emerald-100 group-hover:text-emerald-50' 
                      : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {lesson.title}
                  </h4>
                  
                  {/* Enhanced Description */}
                  <p className="text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {lesson.description}
                  </p>
                  
                  {/* Enhanced Footer */}
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${getDurationColor(lesson.duration_minutes)}`}>
                      <Clock className="h-3 w-3" />
                      <span className="font-medium">{lesson.duration_minutes}min</span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 px-3 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {isCurrent ? 'Playing' : 'Play'}
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
