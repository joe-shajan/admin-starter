import { Skeleton } from "./ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-6 w-[200px]" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}
