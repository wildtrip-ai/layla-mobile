import { Skeleton } from "@/components/ui/skeleton";

export function CountrySkeleton() {
  return (
    <div className="flex items-center gap-2 py-2 px-3">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function CountriesGridSkeleton() {
  // Generate 30 skeleton items for a realistic loading state
  return (
    <>
      {Array.from({ length: 30 }).map((_, index) => (
        <CountrySkeleton key={index} />
      ))}
    </>
  );
}
