import { Info } from "lucide-react";

import { RecentEntryProps } from "./time-entry";
import { getRandomColor } from "@/lib/random-colors";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const RecentEntries = ({
  recentTimeEntries,
  handleRecentClick,
}: {
  recentTimeEntries: RecentEntryProps[];
  handleRecentClick: (timeEntry: RecentEntryProps) => void;
}) => {
  return (
    <section className="border-border bg-card overflow-hidden rounded-lg border">
      <div className="border-border border-b px-4 py-3">
        <h2 className="text-sm font-medium">Recently used</h2>
      </div>

      {recentTimeEntries.length > 0 ? (
        <TooltipProvider delayDuration={200}>
          <ul className="divide-y">
            {recentTimeEntries.map((timeEntry) => (
              <li key={timeEntry.id}>
                <button
                  type="button"
                  onClick={() => handleRecentClick(timeEntry)}
                  className="hover:bg-muted/70 focus-visible:bg-muted/70 flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left transition-colors focus-visible:outline-none"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                        style={
                          timeEntry.project?.id ? { backgroundColor: getRandomColor(timeEntry.project.id) } : undefined
                        }
                        aria-hidden
                      >
                        {timeEntry.project?.client?.name?.charAt(0) ?? "?"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{timeEntry.project?.client?.name}</TooltipContent>
                  </Tooltip>
                  <span className="line-clamp-1 text-sm" title={timeEntry.project?.name}>
                    {timeEntry.project?.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </TooltipProvider>
      ) : (
        <div className="text-muted-foreground flex items-center gap-1.5 px-4 py-4 text-sm">
          <Info size={16} className="shrink-0" />
          <span>No time logged in past 7 days</span>
        </div>
      )}
    </section>
  );
};

export default RecentEntries;
