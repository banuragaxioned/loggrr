import React from "react";
import { Info } from "lucide-react";
import { CustomTooltip } from "@/components/custom/tooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTimeInHours } from "@/lib/helper";

type TimeLoggedCardProps = {
  timecardProp: {
    last30: number;
    billable: number;
  };
};

const BillableCard = ({ timecardProp }: TimeLoggedCardProps) => {
  const billablePercentage = Math.round((timecardProp.billable / timecardProp.last30) * 100);

  return (
    <Card className="p-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <p className="font-semibold">Billable hours</p>
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Info size={16} />
          last 30 days
        </p>
      </CardHeader>
      <CardContent className="mb-1 mt-2 space-y-3 p-0">
        <p className="flex items-center gap-1.5 text-3xl font-semibold">
          {Math.round(getTimeInHours(timecardProp.billable))}{" "}
          <span className="mt-1.5 text-sm font-normal text-muted-foreground">
            / {Math.round(getTimeInHours(timecardProp.last30))}h
          </span>
        </p>
        <CustomTooltip
          trigger={<Progress value={billablePercentage} className="h-[10px] cursor-pointer" />}
          content={`${billablePercentage}%`}
          sideOffset={18}
        />
      </CardContent>
    </Card>
  );
};

export default BillableCard;
