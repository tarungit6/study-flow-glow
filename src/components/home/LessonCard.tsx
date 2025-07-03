import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, Star, User } from "lucide-react";
import { LessonRecommendation } from "@/hooks/api/useRecommendations";
import { Link } from "react-router-dom";

interface LessonCardProps {
  lesson: LessonRecommendation;
  showSimilarity?: boolean;
}

export function LessonCard({ lesson, showSimilarity = false }: LessonCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <Card className="group overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <div className="relative">
        {/* Video Thumbnail Area */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
          {lesson.lesson_video_url ? (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 text-slate-900 ml-1" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
              <div className="text-center text-white/80">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium">Video Lesson</p>
              </div>
            </div>
          )}
          
          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-black/80 text-white border-0 backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(lesson.lesson_duration_minutes)}
            </Badge>
          </div>

          {/* Similarity Score */}
          {showSimilarity && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-teal-500/80 text-white border-0 backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1" />
                {Math.round(lesson.similarity * 100)}% match
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Lesson Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-teal-400 transition-colors duration-200">
            {lesson.lesson_title}
          </h3>
          
          {/* Course Info */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              {lesson.course_title}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{lesson.instructor_name}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {lesson.course_subject && (
              <Badge variant="outline" className="text-xs bg-white/40 dark:bg-slate-800/40">
                {lesson.course_subject}
              </Badge>
            )}
            {lesson.course_difficulty && (
              <Badge className={`text-xs ${getDifficultyColor(lesson.course_difficulty)}`}>
                {lesson.course_difficulty}
              </Badge>
            )}
            {lesson.course_grade_level && (
              <Badge variant="outline" className="text-xs bg-white/40 dark:bg-slate-800/40">
                {lesson.course_grade_level}
              </Badge>
            )}
          </div>

          {/* Lesson Description */}
          {lesson.lesson_content && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {lesson.lesson_content}
            </p>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 rounded-xl"
            >
              <Link to={`/courses/${lesson.course_id}`}>
                <Play className="w-4 h-4 mr-2" />
                Start Lesson
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}