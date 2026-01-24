import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Share2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareTripDialog } from "@/components/trips/ShareTripDialog";
import { DeleteTripDialog } from "@/components/trips/DeleteTripDialog";
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

export function TripCard({ trip, index = 0, onDelete }: TripCardProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();
  const haptics = useHapticFeedback();
  const hasTriggeredHaptic = useRef(false);

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

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShareDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
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
          className={`absolute top-3 right-3 ${statusStyles[trip.status]} backdrop-blur-sm`}
        >
          {statusLabels[trip.status]}
        </Badge>

        {/* Action buttons overlay - hidden by default, shown on hover */}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
          >
            <Link 
              to={linkTo} 
              className="block group"
              onClick={(e) => isDragging && e.preventDefault()}
            >
              {cardContent}
            </Link>
          </motion.div>
        ) : (
          <Link to={linkTo} className="block group">
            {cardContent}
          </Link>
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
