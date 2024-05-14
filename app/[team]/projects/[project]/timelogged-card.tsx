import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTimeInHours } from "@/lib/helper";
import { Hourglass } from "lucide-react";
import React from "react";

type TimeLoggedCardProps = {
  timecardProp: {
    overall: number;
    last30: number;
  };
};

const TimeLoggedCard = ({ timecardProp }: TimeLoggedCardProps) => {
  return (
    <Card className="p-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 text-muted-foreground">
        <p className="text-lg font-semibold">Time logged</p>
        <Hourglass size={16} />
      </CardHeader>
      <CardContent className="mt-2 space-y-1.5 p-0">
        <p className="text-3xl font-semibold">
          {Math.round(getTimeInHours(timecardProp.overall))}
          <span className="text-xl">h</span>
        </p>
        <p className="flex items-center gap-1">
          {Math.round(getTimeInHours(timecardProp.last30))}h{" "}
          <span className="text-sm text-muted-foreground">(last 30 days)</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default TimeLoggedCard;
