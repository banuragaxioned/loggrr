"use client";

import React from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, startOfDay, startOfToday, subDays } from "date-fns";

import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useTimeEntryState } from "@/store/useTimeEntryStore";

export interface TimeEntrySum {
  _sum: {
    time: number | null;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-border bg-primary-foreground p-2 text-xs shadow-sm">
        <p className="label">{format(label, "EEE, dd MMM, yyyy")}</p>
        <p className="desc">Hours logged: {payload[0].value}</p>
      </div>
    );
  }
};

const TimeBarChart = ({ oneWeekTimeEntries }: { oneWeekTimeEntries: TimeEntrySum[] }) => {
  const setPageDate = useTimeEntryState((state) => state.setPageDate);
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    const getLast7Days = () => {
      const today = startOfToday();
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const currentDate = subDays(today, i);
        last7Days.push(format(currentDate, "yyyy-MM-dd"));
      }

      return last7Days;
    };

    const last7Days = getLast7Days();
    const transformedData: any = {};

    oneWeekTimeEntries.forEach((entry: any) => {
      const date = format(new Date(entry.date), "yyyy-MM-dd");
      transformedData[date] = entry._sum.time / 60 || 0;
    });

    // Fill in missing dates with time: 0
    last7Days.forEach((date) => {
      if (!transformedData[date]) {
        transformedData[date] = 0;
      }
    });

    // Convert transformed data back to an array and sort
    const finalData = last7Days.map((date) => ({
      time: transformedData[date],
      date,
    }));

    setData(finalData);
  }, [oneWeekTimeEntries]);

  const formatXAxis = (tickItem: Date) => format(tickItem, "EEE");

  return (
    <Card className="select-none p-4 pb-0 shadow-none">
      <p className="mb-1.5 text-xs font-bold text-muted-foreground">Last 7 day distribution</p>
      <div className="flex h-[158px] items-end justify-end">
        {data ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} onClick={(e) => setPageDate(startOfDay(e.activePayload?.[0].payload.date))}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatXAxis} />
              <YAxis
                width={16}
                tick={{ fontSize: 12 }}
                domain={[0, 8]}
                ticks={[0, 2, 4, 6, 8]} // Specify ticks at intervals of 2
                tickSize={4}
                interval="preserveStartEnd"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="time" fill="red" barSize={16} onClick={(e) => setPageDate(startOfDay(e.date))}>
                {data.map((entry: any, index: any) => (
                  <Cell
                    key={`cell-${index}`}
                    style={
                      {
                        fill: entry.time >= 7 ? "hsl(var(--success))" : "hsl(var(--destructive))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="mb-5 flex h-[80%] w-[96%] justify-evenly">
            {Array.from({ length: 7 }, (_, index) => (
              <Skeleton key={index} className="h-full w-4" />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TimeBarChart;
