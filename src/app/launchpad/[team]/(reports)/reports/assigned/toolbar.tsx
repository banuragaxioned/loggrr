"use client";

import { Input } from "@/components/ui/input";
import { DataTableToolbarProps } from "@/types";
import { DatePicker } from "@/components/datePicker";
import { Dispatch } from "react";
import { DataTableVisibilityToggler } from "@/components/data-table-toggler";
import { Icons } from "@/components/icons";

interface DataTableToolbarExtendedProps<TData> extends DataTableToolbarProps<TData> {
  startDate: Date;
  setStartDate: Dispatch<Date>;
  setWeekend: Dispatch<string>;
  setBillable: Dispatch<string>;
}

const weekOptions = [
  {
    value: "week",
    label: "Week",
    icon: Icons.activity,
  },
  {
    value: "weekdays",
    label: "Week Days",
    icon: Icons.activity,
  },
];

const entryTypeOptions = [
  {
    value: "totalTime",
    label: "Total Time",
    icon: Icons.activity,
  },
  {
    value: "billableTime",
    label: "Billable",
    icon: Icons.activity,
  },
  {
    value: "nonBillableTime",
    label: "Non-Billable",
    icon: Icons.activity,
  },
];

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
        <DataTableVisibilityToggler options={weekOptions} title="View" selectionHandler={setWeekend} />
        <DataTableVisibilityToggler options={entryTypeOptions} title="Entry" selectionHandler={setBillable} />
      </div>
    </div>
  );
}
