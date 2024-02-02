import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";
import { GetSetDateProps } from "@/types";

import { Button } from "@/components/ui/button";
import { getDateString } from "./time-entry";
import { ClassicDatePicker } from "./date-picker";

interface InlineDateProps extends GetSetDateProps {
  dayTotalTime: number;
}

export const InlineDatePicker = ({ date, setDate, dayTotalTime }: InlineDateProps) => {
  const goToDate = (goTo: number) => {
    const selectedDate = dayjs(date).add(goTo, "day").toDate();
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
                  "absolute right-0 top-0 h-2 w-2 fill-destructive stroke-none",
                  dayTotalTime >= 7 && "fill-success",
                  dayTotalTime < 4 && "fill-orange-600",
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
          className={cn(`${dayjs(date).isAfter(dayjs().subtract(1, "day")) ? "disabled" : ""}`)}
          onClick={() => dayjs(date).isBefore(dayjs().subtract(1, "day")) && goToDate(1)}
          title="Next"
        >
          <ChevronRight size={20} />
        </Button>
      </li>
    </ul>
  );
};
