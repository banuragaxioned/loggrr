import React from "react";
import { Info } from "lucide-react";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { RecentEntryProps } from "./time-entry";
import { getRandomColor } from "@/lib/random-colors";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const RecentEntries = ({
  recentTimeEntries,
  handleRecentClick,
}: {
  recentTimeEntries: RecentEntryProps[];
  handleRecentClick: (timeEntry: {}) => void;
}) => {
  return (
    <Card className="overflow-hidden shadow-none">
      <CardHeader className="p-4">
        <p className="text-sm font-medium text-muted-foreground">Recently used</p>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {recentTimeEntries.length > 0 ? (
          <ul className="select-none divide-y">
            {recentTimeEntries.map((timeEntry) => {
              return (
                <li
                  key={timeEntry.id}
                  className="flex cursor-pointer flex-col gap-2 px-4 py-2 hover:bg-muted"
                  onClick={() => handleRecentClick(timeEntry)}
                >
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                            style={
                              timeEntry.project?.id ? { backgroundColor: getRandomColor(timeEntry.project?.id) } : {}
                            }
                          >
                            {timeEntry.project?.client?.name.charAt(0)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{timeEntry.project?.client?.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="line-clamp-1 text-sm" title={timeEntry.project?.name}>
                      {timeEntry.project?.name}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center gap-1.5 p-4 text-sm text-muted-foreground">
            <Info size={16} />
            <span>No time logged in past 7 days</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEntries;
