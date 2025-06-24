
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle, RotateCcw } from 'lucide-react';
import { useMarkLessonComplete } from '@/hooks/api/useLessons';

interface VideoPlayerProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    video_url: string;
    duration_minutes: number;
  };
  onLessonComplete?: () => void;
}

export function VideoPlayer({ lesson, onLessonComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  
  const markLessonComplete = useMarkLessonComplete();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setWatchTime(prev => prev + 1);
      
      // Show complete button when video is near the end (90% watched)
      if (video.duration && video.currentTime / video.duration > 0.9) {
        setShowCompleteButton(true);
      }
    };
    
    const updateDuration = () => setDuration(video.duration);
    const handleVideoEnd = () => setShowCompleteButton(true);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const handleMarkComplete = async () => {
    try {
      await markLessonComplete.mutateAsync({
        lessonId: lesson.id,
        timeSpent: Math.ceil(watchTime / 60)
      });
      onLessonComplete?.();
      setShowCompleteButton(false);
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
          {lesson.title}
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {lesson.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            src={lesson.video_url}
            className="w-full aspect-video"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
            <div className="space-y-4">
              {/* Progress Bar */}
              <div 
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-150 group-hover:from-blue-400 group-hover:to-purple-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 h-12 w-12 rounded-xl"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 h-10 w-10 rounded-lg"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <span className="text-sm font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-lg"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lesson Info & Complete Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <RotateCcw className="h-4 w-4" />
              <span>Duration: {lesson.duration_minutes} minutes</span>
            </div>
          </div>
          
          {/* Floating Complete Button */}
          {showCompleteButton && (
            <Button 
              onClick={handleMarkComplete}
              disabled={markLessonComplete.isPending}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl font-semibold"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {markLessonComplete.isPending ? 'Marking Complete...' : 'Mark Complete & Continue'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
