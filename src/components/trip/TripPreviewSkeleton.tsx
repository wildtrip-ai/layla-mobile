import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function TripPreviewSkeleton() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Trip Header Card Skeleton */}
      <motion.div 
        className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Hero Image Skeleton */}
        <div className="relative h-48 md:h-64 bg-muted">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Trip Stats Skeleton */}
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="text-center p-3 bg-secondary/50 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Skeleton className="h-5 w-5 mx-auto mb-1 rounded-full" />
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* City Stops Skeleton */}
      <motion.div
        className="bg-card rounded-2xl p-4 md:p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              className="flex items-center gap-3 flex-shrink-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
            >
              <div className="relative">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary/30 rounded-full animate-pulse" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
              {i < 3 && <Skeleton className="h-4 w-4 rounded-full" />}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Description Skeleton */}
      <motion.div
        className="bg-card rounded-2xl p-4 md:p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Skeleton className="h-5 w-28 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </motion.div>

      {/* Action Buttons Skeleton */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="h-11 flex-1 rounded-full" />
      </motion.div>

      {/* Generating Message */}
      <motion.div
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="flex gap-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
        </motion.div>
        <span>Crafting your perfect itinerary...</span>
      </motion.div>
    </motion.div>
  );
}
