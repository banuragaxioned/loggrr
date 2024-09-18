import { ChevronLeft, ChevronRight, Circle, Redo2 } from "lucide-react";
import { addDays, isAfter, isToday, startOfToday } from "date-fns";

import { cn } from "@/lib/utils";
import { GetSetDateProps } from "@/types";

import { Button } from "@/components/ui/button";
import { ClassicDatePicker } from "@/components/date-picker";
import { getDateString } from "@/components/time-entry";

interface InlineDateProps extends GetSetDateProps {
  dayTotalTime?: number;
}

export const InlineDatePicker = ({ date, setDate, dayTotalTime }: InlineDateProps) => {
  const isNextDateNotSelectable = isAfter(addDays(date, 1), startOfToday());

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
            if (!isNextDateNotSelectable) {
              goToDate(1);
            }
          }}
          disabled={isNextDateNotSelectable}
          title="Next"
        >
          <ChevronRight size={20} />
        </Button>
      </li>
    </ul>
  );
};
