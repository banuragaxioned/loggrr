import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="col-span-12 grid w-full grid-cols-12">
      <main className="col-span-9 flex flex-col gap-4">
        {/* Horizontal Calendar and date picker */}
        <Skeleton className="h-16 w-full" />
        {/* Time Entry Combobox */}
        <Skeleton className="h-24 w-full" />
        {/* Time Entries */}
        <Skeleton className="h-80 w-full" />
      </main>
      <aside className="col-span-3 m-2 hidden space-y-12 lg:block lg:basis-1/4">
        {/* Quick stats (% of time logged in the last week) */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
        {/* Time Insights (breakdown of time over the last week) */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
        {/* Advanced Analytics (comparision vs. peer average, and vs. self from the previous week) */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
        {/* Quick polls and survey */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </aside>
    </div>
  );
}
