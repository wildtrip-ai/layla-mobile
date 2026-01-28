import { motion } from "framer-motion";

interface TripCardSkeletonProps {
  index?: number;
}

export function TripCardSkeleton({ index = 0 }: TripCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative"
    >
      <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
        {/* Image skeleton */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

          {/* Badge skeleton */}
          <div className="absolute top-3 right-3">
            <div className="h-6 w-20 bg-muted-foreground/20 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-4">
          {/* Title skeleton */}
          <div className="h-6 bg-muted rounded-md animate-pulse mb-3 w-3/4" />

          {/* Stats skeleton */}
          <div className="flex items-center gap-4 mt-2">
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            <div className="h-4 bg-muted rounded animate-pulse w-16" />
            <div className="h-4 bg-muted rounded animate-pulse w-12" />
          </div>

          {/* Button skeleton */}
          <div className="mt-3 -ml-2">
            <div className="h-8 bg-muted rounded animate-pulse w-32" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
