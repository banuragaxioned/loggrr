"use client";

import { Input } from "@/components/ui/input";
import { Assignment, DataTableToolbarProps } from "@/types";
import { DatePicker } from "@/components/date-picker";
import { Dispatch, useEffect } from "react";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";
import { removeDuplicatesFromArray } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

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
  const entryOptionClick: Record<string, { value: string; label: string; next: string }> = {
    totalTime: {
      value: "totalTime",
      label: "Total Time",
      next: "billableTime",
    },
    billableTime: {
      value: "billableTime",
      label: "Billable",
      next: "nonBillableTime",
    },
    nonBillableTime: {
      value: "nonBillableTime",
      label: "Non-Billable",
      next: "totalTime",
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
    <div className="flex items-center justify-between gap-x-3 rounded-xl border border-border p-[15px]">
      <div className="flex flex-1 flex-wrap items-center space-x-2">
        <DatePicker date={startDate} setDate={startDateValidator} />
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-10 w-[150px] lg:w-[250px]"
        />
        <Toggle
          className="rounded-md border data-[state=on]:bg-primary data-[state=on]:text-white"
          onClick={(e) => {
            const element = e.target as Element;
            const dataState = element.getAttribute("data-state");
            setWeekend(dataState === "off" ? "week" : "weekdays");
          }}
        >
          {weekend === "weekdays" ? "Week Days" : "Week"}
        </Toggle>
        <Button onClick={() => handleEntryTime(entryOptionClick[billable])}>{entryOptionClick[billable].label}</Button>
        <DataTableFacetedFilter options={skillList} title="Skills" column={table.getAllColumns()[1]} />
        <DataTableFacetedFilter options={groupList} title="Groups" column={table.getAllColumns()[2]} />
      </div>
    </div>
  );
}
