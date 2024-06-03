"use client";

import { format, startOfDay, subDays } from "date-fns";
import React from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";

import { Card, CardHeader } from "@/components/ui/card";
import { getTimeInHours } from "@/lib/helper";
import { useSearchParams } from "next/navigation";

type TimeChartProps = {
  timeEntries: { date: Date; time: number }[];
  totalDays: number;
};

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

const TimeChart = ({ timeEntries, totalDays }: TimeChartProps) => {
  const searchParams = useSearchParams();
  const selectedRange = searchParams.get("range");
  const [, end] = selectedRange?.split(",") || [];

  const formatXAxis = (tickItem: Date) => format(tickItem, "MMMdd");
  const formatYAxis = (tickItem: number) => `${tickItem}h`;

  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    const getAllDays = () => {
      const endDate = startOfDay((end && new Date(end)) || new Date());
      const daysArray = [];
      for (let i = totalDays - 1; i >= 0; i--) {
        const currentDate = subDays(endDate, i);
        daysArray.push(format(currentDate, "yyyy-MM-dd"));
      }

      return daysArray;
    };

    const populatedDays = getAllDays();
    const transformedData: any = {};

    timeEntries.forEach((entry: any, i) => {
      const date = format(new Date(entry.date), "yyyy-MM-dd");
      transformedData[date] = { ...transformedData[date], time: +getTimeInHours(entry.time) };
    });

    // billableEntries.forEach((entry: any, i) => {
    //   const date = format(new Date(entry.date), "yyyy-MM-dd");
    //   transformedData[date] = { ...transformedData[date], billable: +getTimeInHours(entry.time) };
    // });

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
  }, [timeEntries, totalDays, end]);

  // Suppress warning for defaultProps in Recharts component
  if (process.env.NODE_ENV !== "production") {
    const originalWarn = console.error;
    console.error = (...args) => {
      if (
        args &&
        args?.[0]?.includes(
          "Support for defaultProps will be removed from function components in a future major release.",
        )
      ) {
        return;
      }
      originalWarn(...args);
    };
  }

  return (
    <Card className="select-none p-0 shadow-none">
      <CardHeader className="mt-2 flex flex-row items-center justify-between px-4 py-2">
        <p className="font-semibold">Day-wise distribution</p>
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
