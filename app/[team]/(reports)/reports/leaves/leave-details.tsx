import React from "react";
import { LeaveDetails as LeaveDetailsType } from "@/server/services/leaves";
import { CalendarOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart } from "@tremor/react";
import { format } from "date-fns";

const EmptyState = () => {
  return (
    <Card className="mt-4 flex flex-col items-center justify-center gap-6 py-16 text-center shadow-none">
      <div className="rounded-full bg-muted p-4">
        <CalendarOff className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold tracking-tight">No Leave Data Found</h3>
        <p className="text-muted-foreground">
          Your leave information hasn&apos;t been set up yet. Please contact your HR.
        </p>
      </div>
    </Card>
  );
};

function LeaveDetails({ leave, updatedAt }: { leave: LeaveDetailsType; updatedAt?: Date }) {
  if (!leave) {
    return <EmptyState />;
  }

  const leaveTypes = [
    { type: "Planned", data: leave.planned },
    { type: "Unplanned", data: leave.unplanned },
    { type: "Comp-off", data: leave.compoff },
  ];

  // Calculate total leaves
  const totalTaken = leaveTypes.reduce((acc, item) => acc + item.data.taken, 0);
  const totalEligible = leaveTypes.reduce((acc, item) => acc + item.data.eligible, 0);
  const totalRemaining = totalEligible - totalTaken;

  return (
    <div className="mt-4 space-y-4">
      {/* Total Summary */}
      <Card className="shadow-none">
        <CardContent className="pt-4">
          <h2 className="mb-6 text-left text-xl font-semibold">Summary</h2>
          <div className="mb-2 grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div>
              <div className="text-2xl font-semibold text-primary">{totalEligible}</div>
              <div className="text-lg font-medium uppercase">Granted</div>
              <div className="text-xs uppercase text-muted-foreground">Total leaves eligible</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-primary">{totalTaken}</div>
              <div className="text-lg font-medium uppercase">Taken</div>
              <div className="text-xs uppercase text-muted-foreground">Total leaves used</div>
            </div>
            <div>
              <div className={`text-2xl font-semibold ${totalRemaining < 0 ? "text-red-500" : "text-emerald-500"}`}>
                {totalRemaining}
              </div>
              <div className="text-lg font-medium uppercase">Remaining</div>
              <div className="text-xs uppercase text-muted-foreground">Available balance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave types */}
      <div className="grid gap-4 md:grid-cols-3">
        {leaveTypes.map((item) => {
          const remaining = item.data.eligible - item.data.taken;
          const isOverused = remaining < 0;
          const noData = item.data.eligible === 0 && item.data.taken === 0;

          const chartData = [
            { name: "Taken", value: item.data.taken },
            { name: "Remaining", value: Math.max(0, remaining) },
          ];

          return (
            <Card className="shadow-none" key={item.type}>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">{item.type}</CardTitle>
              </CardHeader>
              <CardContent>
                {noData ? (
                  <div className="my-4 flex h-40 flex-col items-center justify-center gap-2">
                    <CalendarOff className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-medium uppercase text-muted-foreground">Not granted</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-40">
                      <DonutChart
                        data={chartData}
                        category="value"
                        index="name"
                        colors={isOverused ? ["rose", "slate"] : ["zinc", "emerald"]}
                        showAnimation
                        variant="pie"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        <span className="text-lg font-medium uppercase">{item.data.taken}</span> / {item.data.eligible}
                        <span className="ml-1 text-xs font-medium">Used</span>
                      </div>
                      <div
                        className={`text-xs font-medium uppercase ${isOverused ? "text-red-500" : "text-muted-foreground"}`}
                      >
                        {isOverused ? `${Math.abs(remaining)} extra taken` : `${remaining} remaining`}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Last updated */}
      {updatedAt && (
        <div className="px-2 text-right text-sm text-muted-foreground">
          Last updated at: <span className="font-medium text-primary">{format(updatedAt, "MMMM d, yyyy")}</span>
        </div>
      )}
    </div>
  );
}

export default LeaveDetails;
