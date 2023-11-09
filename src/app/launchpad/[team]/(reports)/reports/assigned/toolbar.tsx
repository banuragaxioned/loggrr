"use client";

import { Input } from "@/components/ui/input";
import { Assignment, DataTableToolbarProps } from "@/types";
import { DatePicker } from "@/components/datePicker";
import { Dispatch, useEffect } from "react";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { removeDuplicatesFromArray } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
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
  const entryOptionClick: Record<string, { value: string; label: string; next: string; class: string }> = {
    totalTime: {
      value: "totalTime",
      label: "Total Time",
      next: "billableTime",
      class: "bg-transparent hover:text-slate-500",
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
      class: "bg-indigo-600 border-indigo-600 text-white",
    },
  };

  const handleEntryTime = (data: { next: string }) => {
    setBillable(data.next);
  };

  const group = useSearchParams().get("group");

  const flattedSkillArray = table.getRowModel().rows.flatMap((row) => row.original.skills);

  const uniqueSkillList = removeDuplicatesFromArray(flattedSkillArray.map((skillList) => skillList?.skill) as []);

  const skillList = uniqueSkillList.map((skill) => ({
    label: skill,
    value: skill,
  }));

  const flattedGroupArray = table.options.data.flatMap((assign) => assign.usergroup);

  const uniqueGroupList = removeDuplicatesFromArray(flattedGroupArray.map((group) => group?.name) as []);

  const groupList = uniqueGroupList.map((group) => ({
    label: group,
    value: group,
  }));

  useEffect(() => {
    group && table.getAllColumns()[2].setFilterValue([group]);
  }, [group]);
  //start date validator
  const startDateValidator = (date: Date) => date && setStartDate(date);
  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
      <div className="flex flex-1 flex-wrap items-center space-x-2 space-y-2">
        <DatePicker date={startDate} setDate={startDateValidator} />
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-10 w-[150px] lg:w-[250px]"
        />
        <Toggle
          className="rounded-md border data-[state=on]:border-indigo-600 data-[state=on]:bg-indigo-600 data-[state=on]:text-white"
          onClick={(e) => {
            const element = e.target as Element;
            const dataState = element.getAttribute("data-state");
            setWeekend(dataState === "off" ? "week" : "weekdays");
          }}
        >
          {weekend === "weekdays" ? "Week Days" : "Week"}
        </Toggle>
        <button
          onClick={() => handleEntryTime(entryOptionClick[billable])}
          className={`h-10 rounded-md border px-3 ${entryOptionClick[billable].class}`}
        >
          {entryOptionClick[billable].label}
        </button>
        <DataTableFacetedFilter options={skillList} title="Skills" column={table.getAllColumns()[1]} />
        <DataTableFacetedFilter options={groupList} title="Groups" column={table.getAllColumns()[2]} />
      </div>
    </div>
  );
}
