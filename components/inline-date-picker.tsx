"use client";

import { ChevronLeft, ChevronRight, Redo2 } from "lucide-react";
import { addDays, isAfter, isToday, startOfToday } from "date-fns";

import { cn } from "@/lib/utils";
import { GetSetDateProps } from "@/types";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getDayHoursTone } from "@/lib/heatmap-tone";
import { getDateString } from "./time-entry";
import { ClassicDatePicker } from "./date-picker";

interface InlineDateProps extends GetSetDateProps {
  dayTotalTime?: number;
}

export const InlineDatePicker = ({ date, setDate, dayTotalTime }: InlineDateProps) => {
  const isNextClickable = isAfter(startOfToday(), date);
  const showToday = !isToday(date);

  function goToDate(goTo: number) {
    setDate(addDays(date, goTo));
  }

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => goToDate(-1)} aria-label="Previous day">
              <ChevronLeft size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Previous day</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (isNextClickable) goToDate(1);
              }}
              disabled={!isNextClickable}
              aria-label="Next day"
            >
              <ChevronRight size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Next day</TooltipContent>
        </Tooltip>
        <span className="relative text-sm font-medium tracking-tighter">
          <ClassicDatePicker date={date} setDate={setDate}>
            {getDateString(date)}
            {dayTotalTime != null && dayTotalTime > 0 ? (
              <span
                aria-hidden
                title={`${dayTotalTime.toFixed(2)}h logged`}
                className={cn("absolute -top-1 -right-1 size-2.5 rounded-full", getDayHoursTone(dayTotalTime))}
              />
            ) : null}
          </ClassicDatePicker>
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setDate(startOfToday())}
        title="Go to today"
        tabIndex={showToday ? undefined : -1}
        aria-hidden={!showToday}
        className={cn("shrink-0 transition-opacity", showToday ? "opacity-100" : "pointer-events-none opacity-0")}
      >
        <Redo2 size={16} />
        <span className="ml-2 hidden sm:inline">Today</span>
      </Button>
    </div>
  );
};
