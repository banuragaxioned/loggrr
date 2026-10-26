"use client";

import { eachMonthOfInterval, endOfMonth, format, startOfMonth, subDays } from "date-fns";
import React from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts";

import { Clock } from "lucide-react";

import { Card, CardHeader } from "@/components/ui/card";
import { getTimeInHours } from "@/lib/helper";
import { dbToDateKey, dbToLocalDate, fromDateKey, toDateKey } from "@/lib/date";

const DAILY_CHART_MAX_DAYS = 31;

interface ChartPoint {
  date: string;
  time: number;
}

function roundHours(value: number) {
  return Math.round(value * 100) / 100;
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
    const key = dbToDateKey(entry.date);
    byDay[key] = roundHours((byDay[key] ?? 0) + +getTimeInHours(entry.time));
  });

  const days: ChartPoint[] = [];
  for (let i = 0; i < totalDays; i++) {
    const currentDate = subDays(rangeEnd, totalDays - 1 - i);
    const key = toDateKey(currentDate);
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
    const key = dbToDateKey(entry.date).slice(0, 7);
    byMonth[key] = roundHours((byMonth[key] ?? 0) + +getTimeInHours(entry.time));
  });

  const months = eachMonthOfInterval({
    start: startOfMonth(rangeStart),
    end: endOfMonth(rangeEnd),
  });

  return months.map((month) => {
    const key = format(month, "yyyy-MM");
    return { date: toDateKey(month), time: byMonth[key] ?? 0 };
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

  const labelDate = fromDateKey(label);
  const dateLabel = isMonthlyView ? format(labelDate, "MMMM yyyy") : format(labelDate, "EEE, dd MMM, yyyy");
  const hours = roundHours(payload[0].value);

  return (
    <div className="border-border bg-popover rounded-md border px-2.5 py-1.5 text-xs shadow-xs">
      <p className="font-medium">{dateLabel}</p>
      <p className="text-muted-foreground">
        {hours > 0 ? `Hours logged: ${hours.toFixed(2)}h` : "No time logged"}
      </p>
    </div>
  );
}

const TimeChart = ({ timeEntries, totalDays, startDate, endDate }: TimeChartProps) => {
  const totalTime = getTimeInHours(timeEntries.reduce((acc, curr) => acc + curr.time, 0));
  const isMonthlyView = totalDays > DAILY_CHART_MAX_DAYS;

  const chartData = React.useMemo(() => {
    // Range bounds are UTC-midnight days from the server; read their calendar date, not the local instant
    const rangeStart = dbToLocalDate(startDate);
    const rangeEnd = dbToLocalDate(endDate);

    if (isMonthlyView) {
      return buildMonthlyChartData(rangeStart, rangeEnd, timeEntries);
    }

    return buildDailyChartData(rangeEnd, totalDays, timeEntries);
  }, [timeEntries, startDate, endDate, totalDays, isMonthlyView]);

  const rangeLabel = `${format(dbToLocalDate(startDate), "MMM d, yyyy")} – ${format(dbToLocalDate(endDate), "MMM d, yyyy")}`;

  const formatXAxis = (tickItem: string) =>
    isMonthlyView ? format(fromDateKey(tickItem), "MMM yy") : format(fromDateKey(tickItem), "MMM dd");

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
    <Card className="border-border bg-card select-none p-4 shadow-none">
      <CardHeader className="mb-3 flex flex-row items-start justify-between gap-3 p-0">
        <div className="space-y-1">
          <p className="text-sm font-medium">{isMonthlyView ? "Month-wise distribution" : "Day-wise distribution"}</p>
          <p className="text-muted-foreground text-[11px]">{rangeLabel}</p>
        </div>
        <p className="flex items-center gap-1.5 pt-0.5 tabular-nums">
          <Clock size={14} className="text-muted-foreground shrink-0" />
          <span className="text-foreground text-lg leading-none font-semibold">{totalTime}</span>
          <span className="text-muted-foreground text-sm">h</span>
        </p>
      </CardHeader>
      <div className="flex h-[200px] items-end outline-none focus-within:outline-none sm:h-[260px] md:h-[300px] [&_*]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={formatXAxis}
              tickLine={false}
              axisLine={false}
              interval={isMonthlyView ? 0 : "preserveStartEnd"}
              dy={4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={formatYAxis}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip cursor={false} content={<ChartTooltip isMonthlyView={isMonthlyView} />} />
            <Bar
              dataKey="time"
              fill="hsl(var(--primary))"
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
              maxBarSize={isMonthlyView ? 48 : 28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TimeChart;
