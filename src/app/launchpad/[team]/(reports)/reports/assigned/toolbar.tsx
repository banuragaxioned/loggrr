"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { DataTableToolbarProps } from "@/types";
import { DatePicker } from "@/components/datePicker";
import { Dispatch } from "react";
import { SingleSelectDropdown } from "@/components/ui/single-select-dropdown";

interface DataTableToolbarExtendedProps<TData> extends DataTableToolbarProps<TData> {
  startDate: Date;
  setStartDate: Dispatch<any> | any;
  setWeekend: Dispatch<any> | any;
  setBillable: Dispatch<any> | any;
}

export function DataTableToolbar<TData>({
  table,
  startDate,
  setStartDate,
  setWeekend,
  setBillable,
}: DataTableToolbarExtendedProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  //start date validator
  const startDateValidator = (date: Date) => date && setStartDate(date);
  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
      <div className="flex flex-1 items-center space-x-2">
        <DatePicker date={startDate} setDate={startDateValidator} />
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Icons.reset className="ml-2 h-4 w-4" />
          </Button>
        )}
        {/* weekend dropdown */}
        <SingleSelectDropdown
          selectionHandler={(value: string) => setWeekend(value === "weekend" ? true : false)}
          contentClassName="[&>div]hover:bg-hover"
          placeholder="Weekdays"
          selectionOptions={[
            { title: "Weekend", value: "weekend" },
            { title: "Weekdays", value: "weekdays" },
          ]}
          triggerClassName="w-[120px] 2xl:text-sm"
        />
        {/* time entry type dropdown */}
        <SingleSelectDropdown
          selectionHandler={(value: string) => setBillable(value)}
          contentClassName="[&>div]hover:bg-hover"
          placeholder="Billable"
          selectionOptions={[
            { title: "Billable", value: "billableTime" },
            { title: "Non-Billable", value: "nonBillableTime" },
            { title: "Total Time", value: "totalTime" },
          ]}
          triggerClassName="w-[140px] 2xl:text-sm"
        />
      </div>
    </div>
  );
}
