
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
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
    <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/50 overflow-hidden shadow-2xl">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20">
            <Play className="h-5 w-5 text-teal-400" />
          </div>
          {lesson.title}
        </CardTitle>
        <p className="text-slate-300 leading-relaxed text-lg mt-2">
          {lesson.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Enhanced Video Container */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-700/50">
          <video
            ref={videoRef}
            src={lesson.video_url}
            className="w-full aspect-video"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Enhanced Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6">
            <div className="space-y-4">
              {/* Enhanced Progress Bar */}
              <div 
                className="w-full h-3 bg-white/10 rounded-full cursor-pointer group relative overflow-hidden"
                onClick={handleProgressClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full"></div>
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full transition-all duration-150 shadow-lg shadow-teal-500/30"
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                />
              </div>
              
              {/* Enhanced Controls */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <div className="text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Lesson Info & Complete Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <RotateCcw className="h-4 w-4 text-slate-400" />
              <span>Duration: {lesson.duration_minutes} minutes</span>
            </div>
          </div>
          
          {/* Enhanced Floating Complete Button */}
          {showCompleteButton && (
            <Button 
              onClick={handleMarkComplete}
              disabled={markLessonComplete.isPending}
              className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 rounded-2xl font-bold text-lg border border-emerald-500/30 hover:border-emerald-400/50 transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                {markLessonComplete.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Marking Complete...</span>
                  </>
                ) : (
                  <>
                    <div className="p-1 rounded-full bg-white/20">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span>Mark Complete & Continue</span>
                    <Sparkles className="h-4 w-4 opacity-75" />
                  </>
                )}
              </div>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
