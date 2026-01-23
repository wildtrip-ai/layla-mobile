import { motion } from "framer-motion";
import { Star, Clock, ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/data/tripData";

interface ActivityItemProps {
  activity: Activity;
  index: number;
}

export function ActivityItem({ activity, index }: ActivityItemProps) {
  if (activity.type === "note") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="mb-4"
      >
        <Badge variant="outline" className="mb-2">Note</Badge>
        <p className="text-muted-foreground bg-secondary/50 rounded-lg p-4">
          {activity.title}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="mb-4"
    >
      <Badge variant="outline" className="mb-2">
        {activity.type === "restaurant" ? "Restaurant" : "Activities"}
      </Badge>

      <div className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow">
        {/* Image */}
        {activity.image && (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shrink-0">
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground mb-1 truncate">
            {activity.title}
          </h4>

          {activity.rating && (
            <div className="flex items-center gap-1 text-sm mb-1">
              <span className="font-medium text-foreground">{activity.rating}</span>
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {activity.reviews && (
                <span className="text-muted-foreground">
                  ({activity.reviews.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          {activity.location && (
            <p className="text-sm text-muted-foreground truncate mb-1">
              {activity.location}
            </p>
          )}

          {activity.duration && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{activity.duration}</span>
              {activity.persons && (
                <>
                  <span>•</span>
                  <span>{activity.persons} person</span>
                </>
              )}
            </div>
          )}

          {activity.price && (
            <p className="text-sm font-medium text-foreground mt-1">
              From {activity.price}
            </p>
          )}

          {activity.type === "restaurant" && activity.location && (
            <button className="flex items-center gap-1 text-sm text-primary font-medium mt-2 hover:underline">
              View on Map
              <ExternalLink className="h-3 w-3" />
            </button>
          )}

          {!activity.rating && !activity.duration && activity.persons && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{activity.persons} person</span>
              <Clock className="h-3.5 w-3.5 ml-1" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
