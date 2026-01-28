import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Share2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareTripDialog } from "@/components/trips/ShareTripDialog";
import { DeleteTripDialog } from "@/components/trips/DeleteTripDialog";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import type { SavedTrip } from "@/data/savedTripsData";

interface TripCardProps {
  trip: SavedTrip;
  index?: number;
  onDelete?: (tripId: string) => void;
}

const statusStyles = {
  upcoming: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  past: "bg-secondary text-muted-foreground border-border",
  draft: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const statusLabels = {
  upcoming: "Upcoming",
  past: "Past",
  draft: "Draft",
};

const SWIPE_THRESHOLD = -100;
const LONG_PRESS_DURATION = 500;

export function TripCard({ trip, index = 0, onDelete }: TripCardProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const isMobile = useIsMobile();
  const haptics = useHapticFeedback();
  const hasTriggeredHaptic = useRef(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressing = useRef(false);

  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-150, -80, 0], [1, 0.8, 0]);
  const deleteScale = useTransform(x, [-150, -80, 0], [1, 0.9, 0.8]);

  const isDraft = trip.status === "draft";
  const linkTo = isDraft ? `/new-trip-planner?tripId=${trip.id}` : `/trip/${trip.id}`;

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    hasTriggeredHaptic.current = false;
    
    if (info.offset.x < SWIPE_THRESHOLD) {
      haptics.medium();
      setDeleteDialogOpen(true);
    }
  };

  const handleDrag = (_: any, info: PanInfo) => {
    if (info.offset.x < SWIPE_THRESHOLD && !hasTriggeredHaptic.current) {
      haptics.light();
      hasTriggeredHaptic.current = true;
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      hasTriggeredHaptic.current = false;
    }
  };

  const handleDelete = () => {
    onDelete?.(trip.id);
  };

  const handleShareClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMobileActions(false);
    setShareDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMobileActions(false);
    setDeleteDialogOpen(true);
  };

  // Long press handlers for mobile
  const handleTouchStart = useCallback(() => {
    if (!isMobile) return;
    
    isLongPressing.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPressing.current = true;
      haptics.medium();
      setShowMobileActions(true);
    }, LONG_PRESS_DURATION);
  }, [isMobile, haptics]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if user moves finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // Close mobile actions when clicking outside
  const handleCardClick = (e: React.MouseEvent) => {
    if (isLongPressing.current) {
      e.preventDefault();
      isLongPressing.current = false;
    }
  };

  // Dismiss mobile actions overlay
  const handleDismissActions = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMobileActions(false);
  };

  const cardContent = (
    <motion.div
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm transition-shadow duration-300 hover:shadow-lg relative"
      whileHover={!isMobile ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover"
          whileHover={!isMobile ? { scale: 1.05 } : undefined}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <Badge
          variant="outline"
          className={`absolute top-3 left-3 ${statusStyles[trip.status]} backdrop-blur-sm`}
        >
          {statusLabels[trip.status]}
        </Badge>

        {/* Action buttons overlay - desktop: shown on hover */}
        {!isMobile && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleShareClick}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Mobile long-press action overlay */}
        <AnimatePresence>
          {isMobile && showMobileActions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-4"
              onClick={handleDismissActions}
              onTouchEnd={handleDismissActions}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-14 w-14 rounded-full bg-background shadow-lg"
                  onClick={handleShareClick}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    handleShareClick(e);
                  }}
                >
                  <Share2 className="h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="destructive"
                  size="lg"
                  className="h-14 w-14 rounded-full shadow-lg"
                  onClick={handleDeleteClick}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(e);
                  }}
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-lg font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {trip.title}
        </h3>

        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {trip.dates}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {trip.stats.cities} cities
          </span>
          <span>{trip.stats.days} days</span>
        </div>

        {/* Action */}
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 -ml-2 text-primary hover:text-primary group/btn"
        >
          {isDraft ? "Continue Editing" : "View Itinerary"}
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="relative"
      >
        {/* Delete action background (mobile only) */}
        {isMobile && (
          <motion.div
            className="absolute inset-0 bg-destructive rounded-2xl flex items-center justify-end pr-6"
            style={{ opacity: deleteOpacity }}
          >
            <motion.div style={{ scale: deleteScale }}>
              <Trash2 className="h-6 w-6 text-destructive-foreground" />
            </motion.div>
          </motion.div>
        )}

        {/* Swipeable card (mobile) or regular card (desktop) */}
        {isMobile ? (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            <LocalizedLink 
              to={linkTo} 
              className="block group"
              onClick={(e) => {
                if (isDragging || isLongPressing.current || showMobileActions) {
                  e.preventDefault();
                }
                handleCardClick(e);
              }}
            >
              {cardContent}
            </LocalizedLink>
          </motion.div>
        ) : (
          <LocalizedLink to={linkTo} className="block group">
            {cardContent}
          </LocalizedLink>
        )}
      </motion.div>

      {/* Dialogs */}
      <ShareTripDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        tripId={trip.id}
        tripTitle={trip.title}
      />
      <DeleteTripDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        tripTitle={trip.title}
        onConfirm={handleDelete}
      />
    </>
  );
}
