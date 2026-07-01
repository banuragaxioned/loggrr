"use client";

import { eachMonthOfInterval, endOfMonth, format, startOfDay, startOfMonth, subDays } from "date-fns";
import React from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";

import { Clock } from "lucide-react";

import { Card, CardHeader } from "@/components/ui/card";
import { getTimeInHours } from "@/lib/helper";

const DAILY_CHART_MAX_DAYS = 31;

interface ChartPoint {
  date: string;
  time: number;
}

type TimeChartProps = {
  timeEntries: { date: Date; time: number }[];
  totalDays: number;
  startDate: string;
  endDate: string;
};

function buildDailyChartData(
  rangeEnd: Date,
  totalDays: number,
  timeEntries: { date: Date; time: number }[],
): ChartPoint[] {
  const byDay: Record<string, number> = {};

  timeEntries.forEach((entry) => {
    const key = format(new Date(entry.date), "yyyy-MM-dd");
    byDay[key] = (byDay[key] ?? 0) + +getTimeInHours(entry.time);
  });

  const days: ChartPoint[] = [];
  for (let i = 0; i < totalDays; i++) {
    const currentDate = subDays(rangeEnd, totalDays - 1 - i);
    const key = format(currentDate, "yyyy-MM-dd");
    days.push({ date: key, time: byDay[key] ?? 0 });
  }

  return days;
}

function buildMonthlyChartData(
  rangeStart: Date,
  rangeEnd: Date,
  timeEntries: { date: Date; time: number }[],
): ChartPoint[] {
  const byMonth: Record<string, number> = {};

  timeEntries.forEach((entry) => {
    const key = format(new Date(entry.date), "yyyy-MM");
    byMonth[key] = (byMonth[key] ?? 0) + +getTimeInHours(entry.time);
  });

  const months = eachMonthOfInterval({
    start: startOfMonth(rangeStart),
    end: endOfMonth(rangeEnd),
  });

  return months.map((month) => {
    const key = format(month, "yyyy-MM");
    return { date: format(month, "yyyy-MM-dd"), time: byMonth[key] ?? 0 };
  });
}

function ChartTooltip({
  active,
  payload,
  label,
  isMonthlyView,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  isMonthlyView: boolean;
}) {
  if (!active || !payload?.length || !label) return null;

  const dateLabel = isMonthlyView ? format(new Date(label), "MMMM yyyy") : format(new Date(label), "EEE, dd MMM, yyyy");

  return (
    <div className="border-border bg-primary-foreground rounded-md border p-2 text-xs shadow-xs">
      <p className="label">{dateLabel}</p>
      <p className="desc">Hours logged: {payload[0].value}h</p>
    </div>
  );
}

const TimeChart = ({ timeEntries, totalDays, startDate, endDate }: TimeChartProps) => {
  const totalTime = getTimeInHours(timeEntries.reduce((acc, curr) => acc + curr.time, 0));
  const isMonthlyView = totalDays > DAILY_CHART_MAX_DAYS;

  const chartData = React.useMemo(() => {
    const rangeStart = startOfDay(new Date(startDate));
    const rangeEnd = startOfDay(new Date(endDate));

    if (isMonthlyView) {
      return buildMonthlyChartData(rangeStart, rangeEnd, timeEntries);
    }

    return buildDailyChartData(rangeEnd, totalDays, timeEntries);
  }, [timeEntries, startDate, endDate, totalDays, isMonthlyView]);

  const formatXAxis = (tickItem: string) =>
    isMonthlyView ? format(new Date(tickItem), "MMM yy") : format(new Date(tickItem), "MMM dd");

  const formatYAxis = (tickItem: number) => `${tickItem}h`;

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
    <Card className="p-0 shadow-none select-none">
      <CardHeader className="mt-2 flex flex-row items-center justify-between px-4 py-2">
        <p className="font-semibold">{isMonthlyView ? "Month-wise distribution" : "Day-wise distribution"}</p>
        <p className="flex items-center gap-1.5 text-base leading-none font-semibold tabular-nums">
          <Clock size={16} className="shrink-0" />
          <span>
            {totalTime}
            <span className="text-sm font-normal">h</span>
          </span>
        </p>
      </CardHeader>
      <div className="flex h-[200px] items-end justify-end py-2 pr-8 sm:h-[300px] md:h-[416px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={chartData}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickFormatter={formatXAxis}
              tickLine={false}
              axisLine={false}
              interval={isMonthlyView ? 0 : "preserveStartEnd"}
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip isMonthlyView={isMonthlyView} />} />
            <Bar dataKey="time" style={{ fill: "hsl(var(--primary))" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TimeChart;
