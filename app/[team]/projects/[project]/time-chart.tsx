"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { Info } from "lucide-react";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-border bg-primary-foreground p-2 text-xs shadow-sm">
        <p className="label">{format(label, "EEE, dd MMM, yyyy")}</p>
        <p className="desc">Hours logged: {payload[0].value}h</p>
      </div>
    );
  }
};

const TimeChart = ({ timeEntries }: { timeEntries: { date: Date; time: number }[] }) => {
  const formatXAxis = (tickItem: Date) => format(tickItem, "MMM dd");

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
          <LineChart width={500} height={300} data={timeEntries}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxis}
              interval="equidistantPreserveStart"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor />
            <Line
              type="monotone"
              dataKey="time"
              style={{ stroke: "hsl(var(--muted-foreground))" }}
              dot={{ fill: "hsl(var(--muted-foreground))", strokeWidth: 1, r: 3 }}
              activeDot={{ fill: "hsl(var(--secondary))", stroke: "hsl(var(--muted-foreground))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TimeChart;
