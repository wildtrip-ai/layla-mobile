import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SavedTrip } from "@/data/savedTripsData";

interface TripCardProps {
  trip: SavedTrip;
  index?: number;
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

export function TripCard({ trip, index = 0 }: TripCardProps) {
  const isDraft = trip.status === "draft";
  const linkTo = isDraft ? `/new-trip-planner?tripId=${trip.id}` : `/trip/${trip.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={linkTo} className="block group">
        <motion.div
          className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm transition-shadow duration-300 hover:shadow-lg"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <motion.img
              src={trip.image}
              alt={trip.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <Badge
              variant="outline"
              className={`absolute top-3 right-3 ${statusStyles[trip.status]} backdrop-blur-sm`}
            >
              {statusLabels[trip.status]}
            </Badge>
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
      </Link>
    </motion.div>
  );
}
