"use client";

import { useMemo } from "react";
import { addDays, endOfWeek, format, isAfter, isSameDay, startOfDay, startOfToday } from "date-fns";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { getDayHoursTone } from "@/lib/heatmap-tone";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TimeEntrySum {
  date: Date;
  _sum: {
    time: number | null;
  };
}

interface HeatCell {
  date: Date;
  hours: number;
  key: string;
}

interface WeekHeatmapProps {
  sevenWeekTimeEntries: TimeEntrySum[];
  selectedDate?: Date;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function WeekHeatmap({ sevenWeekTimeEntries, selectedDate }: WeekHeatmapProps) {
  const router = useRouter();
  const today = startOfToday();
  const activeDate = selectedDate ? startOfDay(selectedDate) : today;

  const { cells, weekLabels } = useMemo(() => {
    const hoursByDate = new Map(
      sevenWeekTimeEntries.map((entry) => [format(entry.date, "yyyy-MM-dd"), (entry._sum.time ?? 0) / 60]),
    );

    // endOfWeek is 23:59:59 — normalize to startOfDay so day comparisons work
    const weekEnd = startOfDay(endOfWeek(startOfToday(), { weekStartsOn: 0 }));
    const nextCells: HeatCell[] = [];
    const nextLabels: string[] = [];

    for (let weekOffset = 6; weekOffset >= 0; weekOffset--) {
      nextLabels.push(format(addDays(weekEnd, -weekOffset * 7 - 6), "MMM d"));
    }

    for (let day = 0; day < 7; day++) {
      for (let weekOffset = 6; weekOffset >= 0; weekOffset--) {
        const weekSunday = addDays(weekEnd, -weekOffset * 7 - 6);
        const date = addDays(weekSunday, day);
        const key = format(date, "yyyy-MM-dd");
        nextCells.push({ date, key, hours: hoursByDate.get(key) ?? 0 });
      }
    }

    return { cells: nextCells, weekLabels: nextLabels };
  }, [sevenWeekTimeEntries]);

  function handleSelect(date: Date) {
    if (isAfter(date, today)) return;
    router.push(`?date=${format(date, "yyyy-MM-dd")}`);
  }

  return (
    <section className="border-border bg-card h-full rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium">Heatmap</h2>
          <p className="text-muted-foreground text-[11px]">Last 7 weeks · tap a day</p>
        </div>
        <div className="flex items-center gap-0.5" aria-hidden>
          <span className="bg-muted size-2" />
          <span className="size-2 bg-emerald-200" />
          <span className="size-2 bg-emerald-400" />
          <span className="size-2 bg-emerald-600" />
        </div>
      </div>

      <TooltipProvider delayDuration={120} disableHoverableContent>
        <div className="flex flex-col gap-1">
          {DAY_LABELS.map((label, dayIndex) => (
            <div key={`${label}-${dayIndex}`} className="grid grid-cols-[0.75rem_1fr] items-center gap-2">
              <span className="text-foreground/70 text-[10px]">{label}</span>
              <div className="grid grid-cols-7 gap-1">
                {cells.slice(dayIndex * 7, dayIndex * 7 + 7).map((cell) => {
                  const isFuture = isAfter(cell.date, today);
                  const isToday = isSameDay(cell.date, today);
                  const isSelected = isSameDay(cell.date, activeDate);

                  return (
                    <Tooltip key={cell.key}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          disabled={isFuture}
                          onClick={() => handleSelect(cell.date)}
                          aria-label={`${format(cell.date, "EEE, MMM d")}: ${cell.hours.toFixed(1)}h`}
                          aria-current={isSelected ? "date" : undefined}
                          className={cn(
                            "relative h-4 w-full cursor-pointer rounded-sm transition-opacity outline-none focus-visible:ring-0",
                            getDayHoursTone(cell.hours),
                            isFuture && "cursor-not-allowed opacity-30",
                            !isFuture && "hover:opacity-75",
                            // Today: softer muted ring; selected: fuchsia ring.
                            // When both apply (selected is today), selected wins.
                            isToday && !isSelected && "ring-1 ring-muted-foreground/70 ring-offset-1 ring-offset-card",
                            isSelected && "ring-1 ring-brand-fuchsia ring-offset-1 ring-offset-card",
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="flex-col items-start text-xs">
                        <p className="font-medium">{format(cell.date, "EEE, dd MMM, yyyy")}</p>
                        <p className="text-background/80">
                          {cell.hours > 0 ? `Hours logged: ${cell.hours.toFixed(2)}h` : "No time logged"}
                          {isToday && " · Today"}
                          {isSelected && !isToday && " · Selected"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="mt-1 grid grid-cols-[0.75rem_1fr] gap-2">
            <span />
            <div className="text-foreground/70 flex justify-between text-[10px]">
              <span>{weekLabels[0]}</span>
              <span>{weekLabels.at(-1)}</span>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </section>
  );
}
