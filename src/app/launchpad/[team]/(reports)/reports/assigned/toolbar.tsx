"use client";

import { Input } from "@/components/ui/input";
import { Assignment, DataTableToolbarProps } from "@/types";
import { DatePicker } from "@/components/datePicker";
import { Dispatch } from "react";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { Row } from "@tanstack/react-table";
import { Toggle } from "@/components/ui/toggle";

interface DataTableToolbarExtendedProps<Assignment> extends DataTableToolbarProps<Assignment> {
  startDate: Date;
  setStartDate: Dispatch<Date>;
  setWeekend: Dispatch<string>;
  setBillable: Dispatch<string>;
  billable: string;
  weekend: string;
}

export function DataTableToolbar<TData>({
  table,
  startDate,
  setStartDate,
  setWeekend,
  setBillable,
  billable,
  weekend,
}: DataTableToolbarExtendedProps<Assignment>) {
  let skillValues: Array<{ value: string, label: string }> = [];

  const skillList = table.getRowModel().rows.map((item: Row<Assignment>) => {
    item?.original?.skills?.map((value: { skill: string }) => {
      !skillValues.find((obj) => obj.value.toLowerCase() === value.skill.toLowerCase()) &&
        skillValues.push({
          label: value.skill,
          value: value.skill,
        });
    });
  });

  const entryOptionClick: Record<string, { value: string; label: string, next: string, class: string }> = {
    totalTime: {
      value: "totalTime",
      label: "Total Time",
      next: "billableTime",
      class: "bg-transparent hover:text-slate-500"
    },
    billableTime: {
      value: "billableTime",
      label: "Billable",
      next: "nonBillableTime",
      class: "bg-indigo-500 border-indigo-500 text-white",
    },
    nonBillableTime: {
      value: "nonBillableTime",
      label: "Non-Billable",
      next: "totalTime",
      class: "bg-indigo-600 border-indigo-600 text-white"
    },
  };

  const handleEntryTime = (data: { next: string }) => {
    setBillable(data.next)
  };

  const sortedSkills = skillValues.sort((a: { value: string }, b: { value: string }) => a.value.localeCompare(b.value));

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
        <Toggle className="data-[state=on]:bg-indigo-600 data-[state=on]:text-white data-[state=on]:border-indigo-600 border rounded-md"
          onClick={(e) => {
            const element = e.target as Element;
            const dataState = element.getAttribute("data-state");
            setWeekend(dataState === 'off' ? "week" : "weekdays")
          }}
        >
          {weekend === 'weekdays' ? 'Week Days' : 'Week'}
        </Toggle>
        <button onClick={() => handleEntryTime(entryOptionClick[billable])} className={`border rounded-md h-10 px-3 ${entryOptionClick[billable].class}`}>
          {entryOptionClick[billable].label}
        </button>
        <DataTableFacetedFilter options={sortedSkills} title="Skills" column={table.getAllColumns()[1]} />
      </div>
    </div>
  );
}
