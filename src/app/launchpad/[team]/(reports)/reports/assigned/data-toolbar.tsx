"use client";

import { Input } from "@/components/ui/input";
import { DataTableToolbarProps } from "@/types";
import { DatePicker } from "@/components/datePicker";
import { Dispatch } from "react";
import { SingleSelectDropdown } from "@/components/ui/single-select-dropdown";

interface DataTableToolbarExtendedProps<TData> extends DataTableToolbarProps<TData> {
  startDate: Date;
  setStartDate: Dispatch<Date>;
  setWeekend: Dispatch<boolean>;
  setBillable: Dispatch<string>;
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
          className="h-10 w-[150px] lg:w-[250px]"
        />
        {/* weekend dropdown */}
        <SingleSelectDropdown
          setOptions={(value: string) => setWeekend(value === "weekend" ? true : false)}
          contentClassName="[&>div]hover:bg-hover"
          placeholder="Weekdays"
          options={[
            { id: 1, name: "Week", value: "weekend" },
            { id: 2, name: "Weekdays", value: "weekdays" },
          ]}
          triggerClassName="w-[120px] 2xl:text-sm"
        />
        {/* time entry type dropdown */}
        <SingleSelectDropdown
          setOptions={(value: string) => setBillable(value)}
          contentClassName="[&>div]hover:bg-hover"
          placeholder="Total Time"
          options={[
            { id: 1, name: "Total Time", value: "totalTime" },
            { id: 1, name: "Billable", value: "billableTime" },
            { id: 1, name: "Non-Billable", value: "nonBillableTime" },
          ]}
          triggerClassName="w-[140px] 2xl:text-sm"
        />
      </div>
    </div>
  );
}
