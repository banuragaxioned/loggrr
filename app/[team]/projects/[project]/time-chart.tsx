"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { format, startOfToday, subDays } from "date-fns";
import { Info } from "lucide-react";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type TimeChartProps = {
  timeEntries: { date: Date; time: number }[];
  billableEntries: { date: Date; time: number }[];
};

const DAYS = 30;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-border bg-primary-foreground p-2 text-xs shadow-sm">
        <p className="label">{format(label, "EEE, dd MMM, yyyy")}</p>
        <p className="desc">Hours logged: {payload[0].value}h</p>
        {/* <p className="desc">Billable: {payload[1].value}h</p> */}
      </div>
    );
  }
};

const TimeChart = ({ timeEntries, billableEntries }: TimeChartProps) => {
  const formatXAxis = (tickItem: Date) => format(tickItem, "MMM dd");

  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    const getAllDays = () => {
      const today = startOfToday();
      const daysArray = [];
      for (let i = DAYS - 1; i >= 0; i--) {
        const currentDate = subDays(today, i);
        daysArray.push(format(currentDate, "yyyy-MM-dd"));
      }

      return daysArray;
    };

    const populatedDays = getAllDays();
    const transformedData: any = {};

    timeEntries.forEach((entry: any, i) => {
      const date = format(new Date(entry.date), "yyyy-MM-dd");
      transformedData[date] = { ...transformedData[date], time: entry.time / 60 || 0 };
    });

    billableEntries.forEach((entry: any, i) => {
      const date = format(new Date(entry.date), "yyyy-MM-dd");
      transformedData[date] = { ...transformedData[date], billable: entry.time / 60 || 0 };
    });

    // Fill in missing dates with time: 0
    populatedDays.forEach((date) => {
      if (!transformedData[date]?.time) {
        transformedData[date] = { ...transformedData[date], time: 0 };
      }
      if (!transformedData[date]?.billable) {
        transformedData[date] = { ...transformedData[date], billable: 0 };
      }
    });

    // Convert transformed data back to an array and sort
    const finalData = populatedDays.map((date) => ({
      time: transformedData[date].time,
      billable: transformedData[date].billable,
      date,
    }));

    setData(finalData);
  }, [timeEntries, billableEntries]);

  return (
    <Card className="select-none p-0 shadow-none">
      <CardHeader className="mt-2 flex flex-row items-center justify-between px-4 py-2 text-xs font-bold text-muted-foreground">
        <p className="text-lg font-semibold">Day-wise distribution</p>
        <p className="flex items-center gap-1.5 font-medium">
          <Info size={16} />
          last 30 days
        </p>
      </CardHeader>
      <div className="flex h-[200px] items-end justify-end py-2 pr-8 sm:h-[300px] md:h-[446px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={300} data={data}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxis}
              interval="equidistantPreserveStart"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Line
              type="monotone"
              dataKey="time"
              style={{ stroke: "hsl(var(--muted-foreground))" }}
              dot={{ fill: "hsl(var(--muted-foreground))", strokeWidth: 1, r: 3 }}
              activeDot={{ fill: "hsl(var(--secondary))", stroke: "hsl(var(--muted-foreground))", r: 4 }}
            />
            {/* <Line
              type="monotone"
              dataKey="billable"
              style={{ stroke: "hsl(var(--success))" }}
              dot={{ fill: "hsl(var(--muted-foreground))", strokeWidth: 1, r: 3 }}
              activeDot={{ fill: "hsl(var(--secondary))", stroke: "hsl(var(--muted-foreground))", r: 4 }}
            /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TimeChart;
