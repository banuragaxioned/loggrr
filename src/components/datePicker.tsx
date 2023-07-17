import React, { useEffect, useState } from "react";
import { addDays,format } from "date-fns"
import { Calendar as CalendarIcon,Infinity } from "lucide-react"
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface OnGoing extends DateRange {onGoing?:boolean}

export const DatePicker = ({date,setDate}:any) => {

    return(
        <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
}

export function DateRangePicker({ className,setRange,startDate,isOnGoing }: {className?:React.HTMLAttributes<HTMLDivElement>,setRange?:any,startDate?:any,isOnGoing:boolean}) {
  const initialDate = startDate ? startDate : new Date();
  const [date, setDate] = useState< OnGoing | undefined>({
    from: initialDate,
    to:initialDate,
    onGoing:isOnGoing,
  });

  useEffect(()=>setRange(date),[date]);

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
                  {format(date.from, "LLL dd")} - {date.onGoing ? <Infinity /> :format(date.to, "LLL dd")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto px-0 py-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            today={date?.to}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
         <div className={`flex w-11/12 pb-6 mx-auto justify-end gap-x-2 items-center ${(date?.to && !date.onGoing )|| !date?.from? "invisible" : "visible"}`}>
          <label  htmlFor="set-ongoing" className="cursor-pointer text-sm">Set OnGoing</label>
          <Input type="checkbox" id="set-ongoing" className="w-2 h-2" checked={date?.onGoing} onInput={()=>setDate((prev:any)=>({...prev,onGoing:!date?.onGoing,to:date?.onGoing ? "" : new Date().setFullYear(new Date().getFullYear()+100)}))}/>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}


export function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 5, 1),
    to: new Date(2022, 5, 30),
  });

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
        </PopoverContent>
      </Popover>
    </div>
  );
}
