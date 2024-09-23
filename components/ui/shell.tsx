import * as React from "react";

import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className={cn("mb-8 grid items-start gap-4 p-2", className)} {...props}>
      {children}
    </div>
  );
}

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1>{heading}</h1>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}

export { DashboardShell, DashboardHeader };
