import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

// Import story videos
import romeVideo from "@/assets/stories/rome-colosseum.mp4";
import ammanVideo from "@/assets/stories/amman-city.mp4";
import petraVideo from "@/assets/stories/petra-treasury.mp4";
import wadiRumVideo from "@/assets/stories/wadi-rum.mp4";

interface Story {
  id: string;
  video: string;
  title: string;
  location: string;
}

const stories: Story[] = [
  { id: "1", video: ammanVideo, title: "Amman Citadel", location: "Amman, Jordan" },
  { id: "2", video: petraVideo, title: "Petra Treasury", location: "Petra, Jordan" },
  { id: "3", video: wadiRumVideo, title: "Desert Adventure", location: "Wadi Rum, Jordan" },
  { id: "4", video: romeVideo, title: "The Colosseum", location: "Rome, Italy" },
];

interface StoryPreviewProps {
  open: boolean;
  onClose: () => void;
}

export function StoryPreview({ open, onClose }: StoryPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Swipe gesture state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);
  const isSwipeGesture = useRef(false);

  const STORY_DURATION = 5000; // 5 seconds per story
  const SWIPE_THRESHOLD = 50; // minimum swipe distance in pixels
  const SWIPE_TIME_THRESHOLD = 300; // max time for a swipe in ms

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, onClose]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Pause/Resume handlers
  const handlePause = useCallback(() => {
    if (!isSwipeGesture.current) {
      setIsPaused(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Touch handlers for swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isSwipeGesture.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
    const deltaY = Math.abs(e.touches[0].clientY - (touchStartY.current || 0));
    
    // If horizontal movement is greater than vertical, it's likely a swipe
    if (deltaX > 10 && deltaX > deltaY) {
      isSwipeGesture.current = true;
      // Resume if we were paused by the initial touch
      if (isPaused) {
        handleResume();
      }
    }
  }, [isPaused, handleResume]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartTime.current === null) {
      handleResume();
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    const deltaTime = Date.now() - touchStartTime.current;

    // Check if it's a valid swipe
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && deltaTime < SWIPE_TIME_THRESHOLD) {
      if (deltaX < 0) {
        // Swipe left - go to next
        goToNext();
      } else {
        // Swipe right - go to previous
        goToPrev();
      }
    } else if (!isSwipeGesture.current) {
      // It was a tap, not a swipe - resume from pause
      handleResume();
    }

    // Reset touch state
    touchStartX.current = null;
    touchStartY.current = null;
    touchStartTime.current = null;
    isSwipeGesture.current = false;
  }, [goToNext, goToPrev, handleResume]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goToNext, goToPrev, onClose]);

  // Progress bar timer - respects pause state
  useEffect(() => {
    if (!open || isPaused) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      return;
    }
    
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 50));
      });
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [open, currentIndex, goToNext, isPaused]);

  // Handle video pause/play sync
  useEffect(() => {
    if (!videoRef.current || !open) return;
    if (isPaused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  }, [isPaused, open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setCurrentIndex(0);
      setProgress(0);
    }
  }, [open]);

  // Play video when story changes
  useEffect(() => {
    if (videoRef.current && open) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex, open]);

  if (!open) return null;

  const currentStory = stories[currentIndex];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Muted blurred background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Top right buttons */}
          <div className="absolute top-4 right-4 z-[110] flex items-center gap-2">
            {/* Mute/Unmute button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6 text-white" />
              ) : (
                <Volume2 className="h-6 w-6 text-white" />
              )}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="absolute left-4 md:left-12 z-[110] p-3 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 md:right-12 z-[110] p-3 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Story container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[400px] h-[85vh] max-h-[800px] mx-4 rounded-2xl overflow-hidden bg-black"
          >
            {/* Progress indicators */}
            <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        index < currentIndex
                          ? "100%"
                          : index === currentIndex
                          ? `${progress}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.05 }}
                  />
                </div>
              ))}
            </div>

            {/* Video content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStory.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <video
                  ref={videoRef}
                  src={currentStory.video}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  playsInline
                  autoPlay
                  loop
                />
              </motion.div>
            </AnimatePresence>

            {/* Touch area for swipe gestures + hold to pause */}
            <div 
              className="absolute inset-0 z-10"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handlePause}
              onMouseUp={handleResume}
              onMouseLeave={handleResume}
            >
              {/* Click areas for navigation (desktop) */}
              <div className="absolute inset-0 flex">
                <div 
                  className="w-1/3 h-full cursor-pointer" 
                  onClick={goToPrev}
                />
                <div className="w-1/3 h-full" />
                <div 
                  className="w-1/3 h-full cursor-pointer" 
                  onClick={goToNext}
                />
              </div>
            </div>

            {/* Pause indicator */}
            <AnimatePresence>
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-8 bg-white rounded-sm" />
                      <div className="w-2 h-8 bg-white rounded-sm" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Story info overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-white text-xl font-semibold mb-1">
                  {currentStory.title}
                </h3>
                <p className="text-white/70 text-sm">{currentStory.location}</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
