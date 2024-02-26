import React from "react";
import { Briefcase, Folder, Info } from "lucide-react";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Project } from "@/types";
import { RecentEntryProps } from "./time-entry";

const RecentEntries = ({
  recentTimeEntries,
  handleRecentClick,
}: {
  recentTimeEntries: RecentEntryProps[];
  handleRecentClick: (timeEntry: {}) => void;
}) => {
  return (
    <Card className="col-span-12 overflow-hidden shadow-none sm:col-span-4">
      <CardHeader className="p-4">
        <p className="text-sm font-medium text-muted-foreground">Recently used</p>
      </CardHeader>
      <Separator />
      <CardContent className="max-h-none overflow-y-auto p-0 sm:max-h-[calc(100vh-154px)]">
        {recentTimeEntries.length > 0 ? (
          <ul className="select-none divide-y">
            {recentTimeEntries.map((timeEntry: any) => {
              return (
                <li
                  key={timeEntry.id}
                  className="flex cursor-pointer flex-col gap-2 p-4 hover:bg-muted"
                  onClick={() => handleRecentClick(timeEntry)}
                >
                  <div className="flex items-center gap-2">
                    <Folder size={16} />
                    <span className="text-sm">{timeEntry.project.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    <span className="text-sm">{timeEntry.project.client.name}</span>
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
