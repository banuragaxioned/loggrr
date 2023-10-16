import { useEffect, useState, Dispatch } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GetSetDateProps } from "@/types";
import { getDates } from "./time-entry";
import dayjs from "dayjs";
import { getDateStr } from "./time-entry";

interface InlineDateProps extends GetSetDateProps {
  setDates: Dispatch<Date[]>;
  dates:Date[];
  entries: any;
}

export const InlineDatePicker = ({ date, setDate, setDates,dates, entries }: InlineDateProps) => {
  const clickHandler = (date: Date) => setDates(getDates(date));

  useEffect(() => {
    if (!dates.includes(date)) {
      clickHandler(date);
      setDates(getDates(date));
    }
  }, [date]);

  return (
    <ul className="flex w-11/12 gap-x-2 text-neutral-500">
      <li className="flex basis-[5%] cursor-pointer items-center">
        <Button
          className={cn("border-none outline-none")}
          onClick={() => clickHandler(dayjs(dates[0]).add(-3, "day").toDate())}
          title="Prev"
        >
          <ChevronLeft />
        </Button>
      </li>
      {dates.map((dateInArr, i) => {
        const dateString = getDateStr(dateInArr);
        const [day, month, dateNum] = dateString.replace(",", "").split(" ");
        const loggedTime = entries[dateString]?.dayTotal;
        return (
          <li
            key={i}
            onClick={() => setDate(dateInArr)}
            className={`flex basis-[23%] cursor-pointer items-center justify-center px-2 py-1 text-center ${
              dateString === getDateStr(date)
                ? "relative text-indigo-600 before:absolute before:bottom-0 before:block before:h-[2px] before:w-4/5 before:bg-indigo-600 before:indent-[-9999px] before:content-['a']"
                : ""
            }`}
          >
            <span>
              {dateNum} {day} {month}
            </span>
            {loggedTime && (
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
          className={cn("border-none outline-none")}
          onClick={() =>
            clickHandler(
              dayjs(dates[dates.length - 1])
                .add(3, "day")
                .toDate(),
            )
          }
          title="Next"
        >
          <ChevronRight />
        </Button>
      </li>
    </ul>
  );
};
