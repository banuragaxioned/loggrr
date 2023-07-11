import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UseFormSetValue } from "react-hook-form";
import { AssignFormValues } from "@/types";
import { Checkbox } from "./ui/checkbox";
import dayjs from "dayjs";

export function CalendarDateRangePicker({ setVal }: { setVal: UseFormSetValue<AssignFormValues> }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: dayjs().toDate(),
    to: dayjs().toDate(),
  });

  const [isOngoing, setOngoing] = useState(false)

  useEffect(() => {
    if (date?.from) setVal("date", date?.from);
    if (date?.to) setVal("enddate", date?.to);
  }, [date]);

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="primary"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
          <div className="items-top flex justify-end space-x-2 p-3">
            <Checkbox id="terms1" onCheckedChange={(e) => setVal("isOngoing", !!e)}/>
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ongoing
              </label>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
