import { Skeleton } from "../ui/skeleton";

export const TableSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-5">
      <Skeleton className="h-20 w-full" />
      <div>
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  );
};
