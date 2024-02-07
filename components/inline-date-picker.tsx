import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { addDays, isAfter } from "date-fns";

import { cn } from "@/lib/utils";
import { GetSetDateProps } from "@/types";

import { Button } from "@/components/ui/button";
import { getDateString } from "./time-entry";
import { ClassicDatePicker } from "./date-picker";

interface InlineDateProps extends GetSetDateProps {
  dayTotalTime: number;
}

export const InlineDatePicker = ({ date, setDate, dayTotalTime }: InlineDateProps) => {
  const isNextDateNotSelectable = isAfter(addDays(new Date(date), 1), new Date());

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
      <li>
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
