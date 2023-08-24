"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { entryOptions, viewOptions } from "@/config/filters";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { Icons } from "@/components/icons";
import { DataTableToolbarProps } from "@/types";
import { DatePicker } from "@/components/datePicker";
import { Dispatch } from "react";

interface DataTableToolbarExtendedProps<TData> extends DataTableToolbarProps<TData> {
  startDate: Date;
  setStartDate: Dispatch<any> | any;
}

export function DataTableToolbar<TData>({ table, startDate, setStartDate }: DataTableToolbarExtendedProps<TData>) {
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
      </div>
    </div>
  );
}
