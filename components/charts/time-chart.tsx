"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { format, startOfToday, subDays } from "date-fns";
import { Info } from "lucide-react";
import React from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";

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
  const formatXAxis = (tickItem: Date) => format(tickItem, "MMMdd");
  const formatYAxis = (tickItem: number) => `${tickItem}h`;

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
      <CardHeader className="mt-2 flex flex-row items-center justify-between px-4 py-2">
        <p className="font-semibold">Day-wise distribution</p>
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Info size={16} />
          last 30 days
        </p>
      </CardHeader>
      <div className="flex h-[200px] items-end justify-end py-2 pr-8 sm:h-[300px] md:h-[416px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={data}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickFormatter={formatXAxis}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="time" style={{ fill: "hsl(var(--primary))" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TimeChart;
