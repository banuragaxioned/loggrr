import { useEffect, Dispatch } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GetSetDateProps, TimeEntryDataObj } from "@/types";
import { getDates } from "./time-entry";
import dayjs from "dayjs";
import { getDateString } from "./time-entry";

interface InlineDateProps extends GetSetDateProps {
  setDates: Dispatch<Date[]>;
  dates: Date[];
  entries: TimeEntryDataObj;
}

export const InlineDatePicker = ({ date, setDate, setDates, dates, entries }: InlineDateProps) => {
  const clickHandler = (date: Date) => setDates(getDates(date));

  useEffect(() => {
    if (!dates.includes(date)) {
      clickHandler(date);
      setDates(getDates(date));
    }
  }, [date]);

  return (
    <ul className="flex w-full gap-x-2">
      <li className="flex cursor-pointer items-center">
        <Button
          variant={"outline"}
          size="sm"
          onClick={() => clickHandler(dayjs(dates[0]).add(-3, "day").toDate())}
          title="Prev"
        >
          <ChevronLeft />
        </Button>
      </li>
      {dates.map((dateInArr, i) => {
        const dateString = getDateString(dateInArr);
        const [day, month, dateNum] = dateString.replace(",", "").split(" ");
        const loggedTime = entries[dateString]?.dayTotal;
        const isNotClickable = dayjs(dateInArr).isAfter(dayjs());

        return (
          <li
            key={i}
            onClick={() => !isNotClickable && setDate(dateInArr)}
            className={cn(
              `flex basis-[23%] items-center justify-center gap-2 text-center ${
                dateString === getDateString(date)
                  ? "relative text-primary before:absolute before:bottom-0 before:block before:h-[2px] before:w-4/5 before:bg-primary before:indent-[-9999px] before:content-['a']"
                  : ""
              } ${isNotClickable ? "disabled" : "cursor-pointer"}`,
            )}
          >
            <span className="text-sm font-medium tracking-tighter">
              {day} {month} {dateNum}
            </span>
            {loggedTime && (
              <Circle
                className={cn(
                  "h-2 w-2 stroke-none",
                  `${loggedTime >= 7 ? "fill-success" : loggedTime >= 4 ? "fill-orange-600" : "fill-destructive"}`,
                )}
              ></Circle>
            )}
          </li>
        );
      })}
      <li>
        <Button
          variant={"outline"}
          size="sm"
          className={cn(` ${dayjs(dates[dates.length - 1]).isAfter(dayjs().subtract(1, "day")) ? "disabled" : ""}`)}
          onClick={() =>
            dayjs(dates[dates.length - 1]).isBefore(dayjs().subtract(1, "day")) &&
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
