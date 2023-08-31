"use client"
import * as React from "react";

import { cn } from "@/lib/utils";
import { useCurrentUserStore } from "@/store/currentuserstore";
import { CurrenUserProps } from "@/types";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: CurrenUserProps
}

export function DashboardShell({ user, children, className, ...props }: DashboardShellProps) {
  const [currentUser, fetchUser] = useCurrentUserStore(state => [state.currentUser, state.setCurrentUser])

  React.useEffect(() => {
    if(!currentUser) fetchUser(user) 
  }, [currentUser, user])

  return (
    <div className={cn("grid items-start gap-8 p-2", className)} {...props}>
      {children}
    </div>
  );
}
