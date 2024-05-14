import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTimeInHours } from "@/lib/helper";
import { CircleDollarSign } from "lucide-react";
import React from "react";

type TimeLoggedCardProps = {
  timecardProp: {
    overall: number;
    billable: number;
  };
};

const BillableCard = ({ timecardProp }: TimeLoggedCardProps) => {
  const billablePercentage = Math.round((timecardProp.billable / timecardProp.overall) * 100);

  return (
    <Card className="p-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 text-muted-foreground">
        <p className="text-lg font-semibold">Billable hours</p>
        <CircleDollarSign size={18} />
      </CardHeader>
      <CardContent className="mt-2 space-y-1.5 p-0">
        <p className="flex items-center gap-1.5 text-3xl font-semibold">
          {Math.round(getTimeInHours(timecardProp.billable))}{" "}
          <span className="mt-1.5 text-sm font-normal text-muted-foreground">
            / {Math.round(getTimeInHours(timecardProp.overall))}h
          </span>
        </p>
        <Progress value={billablePercentage} className="h-[12px]" />
        <p className="flex items-center gap-1">{billablePercentage}%</p>
      </CardContent>
    </Card>
  );
};

export default BillableCard;
