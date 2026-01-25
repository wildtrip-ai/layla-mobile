import { motion } from "framer-motion";
import { ExternalLink, Trash2, Plane, Hotel, Car, MapPin, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface BookingItemCardProps {
  type: "flight" | "accommodation" | "transfer" | "activity" | "restaurant";
  title: string;
  subtitle?: string;
  details: string[];
  price?: string;
  image?: string;
  estimatedBadge?: boolean;
  reserveUrl?: string;
  onRemove?: () => void;
}

const typeConfig = {
  flight: {
    label: "Flight",
    icon: Plane,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  accommodation: {
    label: "Accommodation",
    icon: Hotel,
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  transfer: {
    label: "Transfer",
    icon: Car,
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  activity: {
    label: "Activity",
    icon: MapPin,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  restaurant: {
    label: "Restaurant",
    icon: Utensils,
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  },
};

export function BookingItemCard({
  type,
  title,
  subtitle,
  details,
  price,
  image,
  estimatedBadge,
  reserveUrl,
  onRemove,
}: BookingItemCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4 space-y-4"
    >
      {/* Type Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={`${config.color} border-0 gap-1.5`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
        {estimatedBadge && (
          <Badge variant="secondary" className="text-xs">
            Estimated
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex gap-4">
        {image && (
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-medium text-foreground truncate">{title}</h4>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {price && (
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {price}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-0.5">
            {details.map((detail, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {detail}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {reserveUrl ? (
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Reserve Now
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">No booking link</span>
        )}

        {onRemove && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove from booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove "{title}" from your booking review. You can always add it back later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onRemove}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </motion.div>
  );
}
