import { useState, useEffect, Dispatch } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GetSetDateProps, TimeEntryDataObj } from "@/types";
import { getDates } from "./time-entry";
import dayjs from "dayjs";
import { getDateStr } from "./time-entry";

interface InlineDateProps extends GetSetDateProps {
  setDates: Dispatch<Date[]>;
  dates: Date[];
  entries: TimeEntryDataObj;
}

export const InlineDatePicker = ({ date, setDate, setDates, dates, entries }: InlineDateProps) => {
  const [triggerCount, setTriggerCount] = useState<number>(0);
  const clickHandler = (date: Date) => setDates(getDates(date));

  useEffect(() => {
    if (!dates.includes(date)) {
      clickHandler(date);
      setDates(getDates(date));
    }
  }, [date]);

  return (
    <ul className="flex w-full gap-x-2 text-neutral-500">
      <li className="flex basis-[5%] cursor-pointer items-center">
        <Button
          className={cn("border-none p-0 outline-none")}
          onClick={() => {
            clickHandler(dayjs(dates[0]).add(-3, "day").toDate());
            setTriggerCount(triggerCount > 0 ? -1 : triggerCount - 1);
          }}
          title="Prev"
        >
          <ChevronLeft />
        </Button>
      </li>
      {dates.map((dateInArr, i) => {
        const dateString = getDateStr(dateInArr);
        const [day, month, dateNum] = dateString.replace(",", "").split(" ");
        const loggedTime = entries[dateString]?.dayTotal;
        const isNotClickable = dayjs(dateInArr).isAfter(dayjs());
        return (
          <li
            key={i}
            onClick={() => !isNotClickable && setDate(dateInArr)}
            className={`flex basis-[23%] cursor-pointer items-center justify-center text-center text-sm font-medium transition-all duration-300 ${
              dateString === getDateStr(date)
                ? "relative text-indigo-600 before:absolute before:bottom-0 before:block before:h-[2px] before:w-4/5 before:bg-indigo-600 before:indent-[-9999px] before:content-['a']"
                : ""
            } ${isNotClickable ? "opacity-30" : ""} ${dateString === getDateStr(new Date()) ? "text-foreground" : ""} ${
              triggerCount < 0 ? "animate-slide-left" : "animate-slide-right"
            }`}
          >
            <span>
              {dateNum} {day} {month}
            </span>
            {loggedTime > 0 && (
              <span
                className={`ml-1 h-2 w-2 -indent-[9999px] ${
                  loggedTime >= 8 ? "bg-green-600" : loggedTime >= 4 ? "bg-orange-600" : "bg-red-600"
                } rounded-full`}
              >
                text
              </span>
            )}
          </li>
        );
      })}
      <li className="flex basis-[5%] cursor-pointer items-center">
        <Button
          className={cn(
            `border-none p-0 outline-none ${
              dayjs(dates[dates.length - 1]).isAfter(dayjs().subtract(1, "day")) ? "opacity-30" : ""
            }`,
          )}
          onClick={() => {
            dayjs(dates[dates.length - 1]).isBefore(dayjs().subtract(1, "day")) &&
              clickHandler(
                dayjs(dates[dates.length - 1])
                  .add(3, "day")
                  .toDate(),
              );
            setTriggerCount(triggerCount < 0 ? 1 : triggerCount + 1);
          }}
          title="Next"
        >
          <ChevronRight />
        </Button>
      </li>
    </ul>
  );
};
