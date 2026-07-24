"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

interface DonutChartProps {
  data: Record<string, string | number>[];
  category: string;
  index: string;
  colors?: string[];
  variant?: "donut" | "pie";
  className?: string;
  showAnimation?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  rose: "#f43f5e",
  slate: "#94a3b8",
  zinc: "#71717a",
  emerald: "#10b981",
  fuchsia: "#F31B7C",
  eggplant: "#201547",
  lilac: "#C4B5E0",
  citron: "#C5D92C",
  violet: "#7C3AED",
};

function resolveColor(color: string): string {
  return COLOR_MAP[color] ?? color;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="border-border bg-background rounded-md border px-2 py-1.5 text-xs shadow-xs">
      <div className="flex items-center gap-1.5">
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="text-muted-foreground">{item.name}</span>
        <span className="font-medium tabular-nums">{item.value}</span>
      </div>
    </div>
  );
}

export function DonutChart({
  data,
  category,
  index,
  colors = ["zinc", "emerald"],
  variant = "donut",
  className,
  showAnimation = true,
}: DonutChartProps) {
  const chartData = data.map((item, i) => ({
    ...item,
    fill: resolveColor(colors[i % colors.length]),
  }));

  return (
    <div className={cn("aspect-square w-full [&_path]:outline-none [&_svg]:outline-none", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey={category}
            nameKey={index}
            cx="50%"
            cy="50%"
            // 12 o'clock start, clockwise
            startAngle={90}
            endAngle={-270}
            innerRadius={variant === "donut" ? "55%" : 0}
            outerRadius="100%"
            stroke="hsl(var(--card))"
            strokeWidth={1}
            isAnimationActive={showAnimation}
          />
          <Tooltip cursor={false} content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
