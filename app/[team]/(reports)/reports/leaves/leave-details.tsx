import React from "react";
import { LeaveDetails as LeaveDetailsType } from "@/server/services/leaves";
import { CalendarOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DonutChart } from "@tremor/react";

const EmptyState = () => {
  return (
    <Card className="flex flex-col items-center justify-center gap-6 py-16 text-center">
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

function LeaveDetails({ leave }: { leave: LeaveDetailsType }) {
  if (!leave) {
    return <EmptyState />;
  }

  const leaveTypes = [
    { type: "Planned", data: leave.planned, color: "bg-blue-100" },
    { type: "Unplanned", data: leave.unplanned, color: "bg-amber-100" },
    { type: "Comp-off", data: leave.compoff, color: "bg-green-100" },
  ];

  // Calculate total leaves
  const totalTaken = leaveTypes.reduce((acc, item) => acc + item.data.taken, 0);
  const totalEligible = leaveTypes.reduce((acc, item) => acc + item.data.eligible, 0);
  const totalRemaining = totalEligible - totalTaken;

  return (
    <div className="space-y-8">
      {/* Total Summary */}
      <Card>
        <CardContent className="py-10">
          <h2 className="mb-6 text-center text-xl font-semibold tracking-wide">Summary</h2>
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div>
              <div className="text-2xl font-semibold text-primary">{totalEligible}</div>
              <div className="text-lg font-medium">GRANTED</div>
              <div className="-mt-1.5 text-sm text-muted-foreground">Total leaves granted</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-primary">{totalTaken}</div>
              <div className="text-lg font-medium">TAKEN</div>
              <div className="-mt-1.5 text-sm text-muted-foreground">Total leaves used</div>
            </div>
            <div>
              <div className={`text-2xl font-semibold ${totalRemaining < 0 ? "text-destructive" : "text-emerald-500"}`}>
                {totalRemaining}
              </div>
              <div className="text-lg font-medium">REMAINING</div>
              <div className="-mt-1.5 text-sm text-muted-foreground">Available balance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {leaveTypes.map((item) => {
          const remaining = item.data.eligible - item.data.taken;
          const isOverused = remaining < 0;

          const chartData = [
            { name: "Taken", value: item.data.taken },
            { name: "Remaining", value: Math.max(0, remaining) },
          ];

          return (
            <Card key={item.type}>
              <CardHeader>
                <CardTitle className="text-lg">{item.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-40">
                    <DonutChart
                      data={chartData}
                      category="value"
                      index="name"
                      colors={isOverused ? ["rose", "slate"] : ["slate", "emerald"]}
                      showAnimation
                      variant="pie"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {item.data.taken} of {item.data.eligible} used
                    </div>
                    <div className={`text-sm ${isOverused ? "font-medium text-destructive" : "text-muted-foreground"}`}>
                      {isOverused ? `${Math.abs(remaining)} extra taken` : `${remaining} remaining`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default LeaveDetails;
