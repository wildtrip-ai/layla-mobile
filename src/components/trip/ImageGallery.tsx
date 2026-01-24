import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export interface GalleryImage {
  src: string;
  title: string;
  location?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const swipeStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwiping = useRef(false);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    resetZoom();
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    resetZoom();
  };

  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetZoom();
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetZoom();
  }, [images.length]);

  // Touch handlers for pinch-to-zoom and swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchDistance.current = distance;
      lastTouchCenter.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
      isSwiping.current = false;
    } else if (e.touches.length === 1 && scale === 1) {
      // Single touch - potential swipe
      swipeStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      isSwiping.current = true;
    }
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      // Pinch gesture
      e.preventDefault();
      isSwiping.current = false;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scaleChange = distance / lastTouchDistance.current;
      setScale((prev) => Math.min(Math.max(prev * scaleChange, 1), 4));
      lastTouchDistance.current = distance;

      // Pan while zoomed
      if (lastTouchCenter.current) {
        const newCenter = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };
        setTranslate((prev) => ({
          x: prev.x + (newCenter.x - lastTouchCenter.current!.x),
          y: prev.y + (newCenter.y - lastTouchCenter.current!.y),
        }));
        lastTouchCenter.current = newCenter;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Handle swipe gesture
    if (isSwiping.current && swipeStart.current && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - swipeStart.current.x;
      const deltaY = touch.clientY - swipeStart.current.y;
      const deltaTime = Date.now() - swipeStart.current.time;
      
      // Check if it's a valid horizontal swipe
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
      const isQuickEnough = deltaTime < 300;
      const isLongEnough = Math.abs(deltaX) > 50;
      
      if (isHorizontalSwipe && (isQuickEnough || isLongEnough) && scale === 1) {
        if (deltaX > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
    }

    // Reset refs
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;
    swipeStart.current = null;
    isSwiping.current = false;
    
    // Reset if zoomed out
    if (scale <= 1) {
      resetZoom();
    }
  }, [scale, goToPrevious, goToNext]);

  // Double tap to zoom
  const lastTap = useRef<number>(0);
  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      e.preventDefault();
      if (scale > 1) {
        resetZoom();
      } else {
        setScale(2.5);
      }
    }
    lastTap.current = now;
  }, [scale]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, goToPrevious, goToNext]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="py-4"
      >
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-2xl cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Caption overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 pt-8">
                      <h4 className="text-white font-medium text-sm md:text-base line-clamp-1">
                        {image.title}
                      </h4>
                      {image.location && (
                        <div className="flex items-center gap-1 text-white/80 text-xs md:text-sm mt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{image.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-4 h-10 w-10 bg-background/90 backdrop-blur-sm border-border hover:bg-background" />
          <CarouselNext className="right-2 md:-right-4 h-10 w-10 bg-background/90 backdrop-blur-sm border-border hover:bg-background" />
        </Carousel>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center pt-14"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted z-10"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 text-sm text-muted-foreground">
              {activeIndex + 1} / {images.length}
            </div>

            {/* Previous button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 h-12 w-12 rounded-full bg-muted/50 hover:bg-muted z-10 hidden md:flex"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Main image with pinch-to-zoom */}
            <div
              ref={imageRef}
              className="flex items-center justify-center w-full touch-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  scale: scale,
                  x: translate.x,
                  y: translate.y,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: scale === 1 ? 0.2 : 0.05 }}
                className="relative"
                onTouchEnd={handleDoubleTap}
              >
                <img
                  src={images[activeIndex].src}
                  alt={images[activeIndex].title}
                  className="max-h-[70vh] max-w-[90vw] object-contain rounded-lg"
                  draggable={false}
                />
              </motion.div>
            </div>

            {/* Caption in lightbox */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center px-4">
              <h4 className="text-foreground font-medium text-base md:text-lg">
                {images[activeIndex].title}
              </h4>
              {images[activeIndex].location && (
                <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{images[activeIndex].location}</span>
                </div>
              )}
            </div>

            {/* Next button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 h-12 w-12 rounded-full bg-muted/50 hover:bg-muted z-10 hidden md:flex"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                    resetZoom();
                  }}
                  className={`w-16 h-12 rounded-md overflow-hidden transition-all ${
                    index === activeIndex
                      ? "ring-2 ring-primary opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Zoom hint for mobile */}
            {scale === 1 && (
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-xs text-muted-foreground md:hidden">
                Swipe to navigate • Pinch to zoom • Double-tap to zoom in
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
