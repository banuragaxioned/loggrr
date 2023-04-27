"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/helper"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 focus:ring-accent-foreground-light dark:focus:ring-accent-foreground-dark"
        ),
        day_selected:
          "bg-primary-light dark:bg-primary-dark text-primary-foreground-light dark:text-primary-foreground-dark hover:bg-primary-light dark:hover:bg-primary-dark hover:text-primary-foreground-light dark:hover:text-primary-foreground-dark focus:bg-primary-light dark:focus:bg-primary-dark focus:text-primary-foreground-light dark:focus:text-primary-foreground-dark",
        day_today: "bg-accent-light dark:bg-accent-dark text-accent-foreground dark:text-accent-foreground-dark",
        day_outside: "text-muted-foreground-light dark:text-muted-foreground-dark opacity-50",
        day_disabled: "text-muted-foreground-light dark:text-muted-foreground-dark opacity-50",
        day_range_middle:
          "aria-selected:bg-accent-light dark:aria-selected:bg-accent-dark rounded-0 aria-selected:text-accent-foreground-light dark:aria-selected:text-accent-foreground-dark",
        day_hidden: "invisible",
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 p-0 opacity-50 hover:opacity-100 ring-0" 
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground-light dark:text-muted-foreground-dark rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent-light dark:[&:has([aria-selected])]:bg-accent-dark first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />  
  )
}
Calendar.displayName = "Calendar"

export { Calendar }