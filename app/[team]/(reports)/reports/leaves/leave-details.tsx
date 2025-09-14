import React from "react";
import { LeaveDetails as LeaveDetailsType } from "@/server/services/leaves";
import { CalendarOff, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  return (
    <div>
      <pre>{JSON.stringify(leave, null, 2)}</pre>
    </div>
  );
}

export default LeaveDetails;
