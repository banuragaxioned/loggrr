"use client";

import { ColumnDef, Column, RowData } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

//function to get date between two dates
const getDatesInRange = (startDate: any, days: number, includeWeekend: boolean) => {
  const dates = [];
  let start = startDate,
    count = 0;
  while (count < days) {
    const currentDate = new Date(start);
    if (includeWeekend ? true : currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const dateKey = currentDate.toISOString().split("T")[0];
      dates.push({
        date: currentDate.getDate(),
        month: currentDate.toLocaleString("en-us", { month: "short" }),
        day: currentDate.toLocaleString("en-us", { weekday: "short" }),
        dateKey,
      });
      count++;
    }
    start = new Date(start).setDate(new Date(start).getDate() + 1);
  }
  return dates;
};

//function to create dynamic columns based on dates
const getDynamicColumns = () => {
  const days = 7;
  return getDatesInRange(Date.parse(new Date().toDateString()), days, false).map((dateObj, i) => {
    return {
      accessorKey: `timeAssigned.${dateObj.dateKey}.billable`,
      header: ({ column }: { column: Column<any> }) => (
        <DataTableColumnHeader column={column} title={`${dateObj.date} ${dateObj.month} ${dateObj.day}`} />
      ),
      meta: {
        className: "w-[13%]",
      },
    };
  });
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div
          className={`flex items-center gap-x-2 ${
            row.depth > 0
              ? "relative ml-6 before:absolute before:-left-4 before:-top-[34px] before:block  before:h-[52px] before:w-4 before:rounded-bl-md before:border-b-2 before:border-l-2 before:border-slate-300 before:-indent-[9999px] before:content-['a']"
              : ""
          }`}
        >
          {row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                className: "cursor-pointer",
              }}
            >
              {row.getIsExpanded() ? (
                <Icons.chevronDown className="h-4 w-4" />
              ) : (
                <Icons.chevronRight className="h-4 w-4" />
              )}
            </button>
          ) : null}
          <UserAvatar
            user={{
              name: row.original.name ? row.original.name : "",
              image: row.original.image ? row.original.image : "",
            }}
            className="z-10 mr-2 inline-block h-5 w-5"
          />
          <span>{row.original.name}</span>
        </div>
      );
    },
    meta: {
      className: "w-[12.5%]",
    },
  },
  ...getDynamicColumns(),
];
