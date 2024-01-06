import * as React from "react";

import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className={cn("max-w-8xl container grid items-start gap-4 p-4", className)} {...props}>
      {children}
    </div>
  );
}
