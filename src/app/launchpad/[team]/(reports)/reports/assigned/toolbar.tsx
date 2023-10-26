"use client";

import { Input } from "@/components/ui/input";
import { Assignment, DataTableToolbarProps } from "@/types";
import { DatePicker } from "@/components/datePicker";
import { Dispatch, useEffect } from "react";
import { DataTableVisibilityToggler } from "@/components/data-table-toggler";
import { Icons } from "@/components/icons";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { removeDuplicatesFromArray } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import {Row} from "@tanstack/react-table";
import { Toggle } from "@/components/ui/toggle";

interface DataTableToolbarExtendedProps<Assignment> extends DataTableToolbarProps<Assignment> {
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
}: DataTableToolbarExtendedProps<Assignment>) {

  const group = useSearchParams().get("group");

  const flattedSkillArray = table.getRowModel().rows.flatMap(row => row.original.skills)

  const uniqueSkillList = removeDuplicatesFromArray(flattedSkillArray.map(skillList => skillList?.skill) as [])

  const skillList = uniqueSkillList.map(skill => ({
    label: skill,
    value: skill
  }))

  const flattedGroupArray = table.options.data.flatMap((assign) => assign.usergroup)

  const uniqueGroupList = removeDuplicatesFromArray(flattedGroupArray.map(group => group?.name) as [])

  const groupList = uniqueGroupList.map(group => ({
    label: group,
    value: group
  }))

  useEffect(() => {
    group && table.getAllColumns()[2].setFilterValue([group])
  }, [group])
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
        <Toggle className="data-[state=on]:bg-[#5048e5] data-[state=on]:text-white data-[state=on]:border-[#5048e5] border rounded-md" 
          onClick={(e) => {
            const element = e.target as Element;
            const dataState = element.getAttribute("data-state");
            setWeekend(dataState === 'off' ? "week" : "weekdays")
          }}
        >
          Week
        </Toggle>
        <DataTableVisibilityToggler options={entryTypeOptions} title="Entry" selectionHandler={setBillable} />
        <DataTableFacetedFilter options={skillList} title="Skills" column={table.getAllColumns()[1]} />
        <DataTableFacetedFilter options={groupList} title="Groups" column={table.getAllColumns()[2]} />
      </div>
    </div>
  );
}
