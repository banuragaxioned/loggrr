import { ChevronLeft, ChevronRight, Circle, Redo2 } from "lucide-react";
import { addDays, isAfter, isToday, startOfToday } from "date-fns";

import { cn } from "@/lib/utils";
import { GetSetDateProps } from "@/types";

import { Button } from "@/components/ui/button";
import { getDateString } from "./time-entry";
import { ClassicDatePicker } from "./date-picker";

interface InlineDateProps extends GetSetDateProps {
  dayTotalTime?: number;
}

export const InlineDatePicker = ({ date, setDate, dayTotalTime }: InlineDateProps) => {
  const isNextClickable = isAfter(startOfToday(), date);

  const goToDate = (goTo: number) => {
    const selectedDate = addDays(date, goTo);
    setDate(selectedDate);
  };

  const renderDate = () => {
    const dateString = getDateString(date);

    return (
      <li className="flex w-full items-center justify-center gap-2 text-center">
        <span className="relative text-sm font-medium tracking-tighter">
          <ClassicDatePicker date={date} setDate={setDate}>
            {dateString}
            {dayTotalTime && (
              <Circle
                className={cn(
                  "absolute -right-1 -top-1 h-3 w-3 stroke-none",
                  dayTotalTime >= 7 && "fill-success",
                  dayTotalTime < 7 && "fill-destructive",
                )}
              />
            )}
          </ClassicDatePicker>
        </span>
      </li>
    );
  };

  return (
    <ul className="flex w-full gap-x-2">
      <li className="flex cursor-pointer items-center">
        <Button variant="outline" size="icon" onClick={() => goToDate(-1)} title="Prev">
          <ChevronLeft size={20} />
        </Button>
      </li>
      {renderDate()}
      <li className="relative">
        {!isToday(date) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDate(startOfToday());
            }}
            title="Go to today"
            className="absolute bottom-0 right-11"
          >
            <Redo2 size={16} />
            <p className="ml-2 hidden sm:block">Today</p>
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (isNextClickable) {
              goToDate(1);
            }
          }}
          disabled={!isNextClickable}
          title="Next"
        >
          <ChevronRight size={20} />
        </Button>
      </li>
    </ul>
  );
};
