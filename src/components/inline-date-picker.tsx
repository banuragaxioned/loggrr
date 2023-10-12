import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GetSetDateProps } from "@/types";

const getDates = (date: Date) => {
  let arr = [],
    i = -2;
  for (i; i < 3; i++) arr.push(dayjs(date).add(i, "day").toDate());
  return arr;
};

export const InlineDatePicker = ({ date, setDate }: GetSetDateProps) => {
  const [dates, setDates] = useState<Date[]>(getDates(new Date()));
  const clickHandler = (date: Date) => setDates(getDates(date));

  // useEffect(() => {
  //   clickHandler(date);
  // }, [date]);

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
        const dateString = dateInArr.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short" });
        const [day, month, dateNum] = dateString.replace(",", "").split(" ");
        return (
          <li
            key={i}
            onClick={() => setDate(dateInArr)}
            className={`flex basis-[23%] cursor-pointer items-center justify-center px-2 py-1 text-center ${
              dateString === date.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short" })
                ? "relative text-indigo-600 before:absolute before:bottom-0 before:block before:h-[2px] before:w-4/5 before:bg-indigo-600 before:indent-[-9999px] before:content-['a']"
                : ""
            }`}
          >
            <span>{dateNum} {day} {month}</span>
            <span className={`-indent-[9999px] w-2 h-2 ml-1 bg-red-600 rounded-full`}>text</span>
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
