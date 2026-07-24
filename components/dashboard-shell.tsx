"use client";

import { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  aside: ReactNode;
}

/**
 * Team home grid: primary logger (9) + analytics aside (3).
 * Aside grows with content up to the viewport; scrolls only if needed on large screens.
 * `#board-notebook-slot` receives the board notebook under heatmap.
 */
export function DashboardShell({ children, aside }: DashboardShellProps) {
  return (
    <div className="col-span-12 mb-6 grid w-full grid-cols-12 items-start gap-4">
      <main className="col-span-12 flex flex-col gap-4 lg:col-span-9">{children}</main>
      <aside className="col-span-12 space-y-4 lg:sticky lg:top-[4.5rem] lg:col-span-3 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto">
        {aside}
        <div id="board-notebook-slot" className="flex flex-col gap-4 empty:hidden" />
      </aside>
    </div>
  );
}
