import { Skeleton } from "@/components/ui/skeleton";

export function FavoriteCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Skeleton className="w-full h-full" />

        {/* Category badge placeholder */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Country flag placeholder */}
        <div className="absolute bottom-3 right-3">
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 mb-2" />

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-2">
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Description */}
        <div className="mt-2 space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-3">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  );
}

interface FavoritesGridSkeletonProps {
  count?: number;
}

export function FavoritesGridSkeleton({ count = 6 }: FavoritesGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <FavoriteCardSkeleton key={index} />
      ))}
    </div>
  );
}
