import * as React from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function QuickStatsWidget() {
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const projectInsights = api.stats.getQuickStats.useQuery({
    tenant: currentTenant,
  });
  return (
    <ScrollArea className="h-44 w-full rounded-md border border-slate-100 dark:border-slate-700">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Time Insights</h4>
        {projectInsights.data &&
          projectInsights.data.map((stats) => (
            <React.Fragment key={stats.projectId}>
              <div className="flex justify-between text-sm" key={stats.projectId}>
                <p>{stats.projectName}</p>
                <p>Total: {stats.total}m</p>
              </div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
      </div>
    </ScrollArea>
  );
}
