import { cn } from "@/lib/helper";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-muted animate-pulse rounded-md bg-zinc-400", className)} {...props} />;
}

export { Skeleton };
