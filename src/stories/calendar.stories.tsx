import React, { useState } from 'react'
import { Calendar } from "../components/ui/calendar"
import { addDays, differenceInDays, format, startOfMonth, startOfYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "../lib/helper"
import { Button } from "../components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const CalendarDatePicker = () => {
  const [date, setDate] = useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="primary"
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

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="primary"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
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
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const CalendarRelativeDatePicker = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: new Date(),
  })

  const [isOpen, setOpen] = useState(false)

  const currentDate = new Date()

  return (
    <div className={cn("flex border border-border rounded-md w-[564px] bg-popover", isOpen && "ring-ring ring-2")}>
      <div className={cn("flex items-center text-popover-foreground text-left font-normal py-2 px-4", !date && "text-muted-foreground")}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "LLL dd, y")} -{" "}
              {format(date.to, "LLL dd, y")}
            </>
          ) : (
            format(date.from, "LLL dd, y")
          )
        ) : (
          <span>Pick a date</span>
        )}
      </div>
      <div className='grow'>
        <Select onValueChange={(value) => setDate({ from: addDays(currentDate, -(parseInt(value))), to: currentDate })}>
          <SelectTrigger onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} className='group border-0 border-l border-border focus:border-l w-full bg-popover text-popover-foreground rounded-l-none focus:ring-0'>
            <SelectValue placeholder="Select" className='basis-3/4' />
          </SelectTrigger>
          <SelectContent position='popper' sticky='always' hideWhenDetached>
            <SelectItem value="7"><SelectItemText value={""}>Last 7 days</SelectItemText></SelectItem>
            <SelectItem value="30"><SelectItemText value={""}>Last 30 days</SelectItemText></SelectItem>
            <SelectItem value={differenceInDays(currentDate, startOfMonth(currentDate)).toString()}><SelectItemText value={""}>Month to Date</SelectItemText></SelectItem>
            <SelectItem value={differenceInDays(currentDate, startOfYear(currentDate)).toString()}><SelectItemText value={""}>Year to Date</SelectItemText></SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function CalendarDatePickerWithPresets() {
  const [date, setDate] = useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="primary"
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="0">
                <SelectItemText value={''}>
                  Today
                </SelectItemText>
              </SelectItem>
              <SelectItem value="1">
                <SelectItemText value={''}>
                  Tomorrow
                </SelectItemText></SelectItem>
              <SelectItem value="3">
                <SelectItemText value={''}>
                  In 3 days
                </SelectItemText>
              </SelectItem>
              <SelectItem value="7">
                <SelectItemText value={''}>
                  In a week
                </SelectItemText></SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="rounded-md border border-border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  )
}