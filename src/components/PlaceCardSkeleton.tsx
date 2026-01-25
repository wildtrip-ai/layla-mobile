import { Skeleton } from "@/components/ui/skeleton";

export function PlaceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card border border-border shadow-sm">
      <div className="aspect-[4/3] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-1 shrink-0">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <div className="mt-2 space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

interface PlacesSectionSkeletonProps {
  count?: number;
  gridCols?: string;
}

export function PlacesSectionSkeleton({ 
  count = 4, 
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
}: PlacesSectionSkeletonProps) {
  return (
    <div className={`grid ${gridCols} gap-4 md:gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <PlaceCardSkeleton key={index} />
      ))}
    </div>
  );
}
