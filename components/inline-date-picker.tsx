import { useEffect, Dispatch } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";
import { GetSetDateProps, TimeEntryDataObj } from "@/types";

import { Button } from "@/components/ui/button";
import { getDates } from "./time-entry";
import { getDateString } from "./time-entry";

interface InlineDateProps extends GetSetDateProps {
  entries: TimeEntryDataObj;
}

export const InlineDatePicker = ({ date, setDate, entries }: InlineDateProps) => {
  const goToDate = (goTo: number) => {
    const selectedDate = dayjs(date).add(goTo, "day").toDate();
    setDate(selectedDate);
  };

  const renderDate = () => {
    const dateString = getDateString(date);
    const loggedTime = entries[dateString]?.dayTotal;

    return (
      <li className="flex w-full items-center justify-center gap-2 text-center">
        <span className="relative text-sm font-medium tracking-tighter">
          {dateString}
          {loggedTime && (
            <Circle
              className={cn(
                "absolute -right-4 top-1.5 h-2 w-2 fill-destructive stroke-none",
                loggedTime >= 7 && "fill-success",
                loggedTime < 4 && "fill-orange-600",
              )}
            />
          )}
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
