import { Skeleton } from "./ui/skeleton";

export function SkeletonCard() {
  return (
    <>
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-10 w-2/3" />
      </div>
    </>
  );
}
