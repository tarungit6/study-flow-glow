
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
  
  const markLessonComplete = useMarkLessonComplete();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleTimeUpdate = () => {
      setWatchTime(prev => prev + 1);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('timeupdate', handleTimeUpdate);
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
        timeSpent: Math.ceil(watchTime / 60) // Convert seconds to minutes
      });
      onLessonComplete?.();
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
    <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl">{lesson.title}</CardTitle>
        <p className="text-muted-foreground">{lesson.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative bg-black rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            src={lesson.video_url}
            className="w-full aspect-video"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="space-y-3">
              {/* Progress Bar */}
              <div 
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Duration: {lesson.duration_minutes} minutes
          </div>
          
          <Button 
            onClick={handleMarkComplete}
            disabled={markLessonComplete.isPending}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
