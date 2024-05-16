import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTimeInHours } from "@/lib/helper";
import { Info } from "lucide-react";
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <p className="font-semibold">Time logged</p>
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Info size={16} />
          last 30 days
        </p>
      </CardHeader>
      <CardContent className="mt-2 space-y-2.5 p-0">
        <p className="text-3xl font-semibold">
          {Math.round(getTimeInHours(timecardProp.last30))}
          <span className="text-xl">h</span>
        </p>
        <div className="text-sm text-muted-foreground">
          {Math.round(getTimeInHours(timecardProp.overall))}h overall time logged
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeLoggedCard;
