"use client";

import { ColumnDef, Column, Row, RowData } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";
import { TableInput } from "@/components/table-input";
import { Dispatch } from "react";
import { AssignmentSubRow } from "@/types";
import dayjs from "dayjs";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface Assignment {
  name: string;
  image: string | null;
  userId: number;
  userName: string;
  title: string;
  subRows: AssignmentSubRow[] | undefined;
}

const getTotal = (subRows: AssignmentSubRow[] | undefined, key: string, billable: string) => {
  let total = 0;
  subRows?.length &&
    subRows?.map((arr: any) => {
      total += arr.timeAssigned[key] ? arr.timeAssigned[key][billable] : 0;
    });
  return total;
};

//function to get date between two dates
const getDatesInRange = (startDate: Date, days: number, includeWeekend: boolean) => {
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
    start = dayjs(startDate).add(1, "day").toDate();
  }
  return dates;
};

//function to create dynamic columns based on dates
const createDynamicColumns = (
  startDate: Date,
  billable: string,
  weekend: boolean,
  setSubmitCount: Dispatch<number>,
): ColumnDef<Assignment>[] | any => {
  const days = 7;
  const createdColumns = getDatesInRange(startDate, days, weekend).map((dateObj, i) => {
    const date: any = dateObj.dateKey;
    return {
      accessorKey: `timeAssigned.${dateObj.dateKey}.${billable}`,
      header: ({ column }: { column: Column<Assignment> }) => (
        <DataTableColumnHeader column={column} title={`${dateObj.date} ${dateObj.month} ${dateObj.day}`} />
      ),
      cell: ({ row, column }: { row: Row<AssignmentSubRow>; column: Column<Assignment> }) => {
        const subRow = row.original;
        const assignedObj = row.depth > 0 ? subRow.timeAssigned[date] : null;
        return (
          <div className="px-0 py-0">
            {row.subRows.length || row.depth < 1 ? (
              <span className="block text-center">{getTotal(row.originalSubRows, date, billable)}</span>
            ) : (
              <TableInput
                hours={row.renderValue(column.id) ? row.renderValue(column.id) : 0}
                data={{
                  hoursObj: assignedObj ? assignedObj : {},
                  userName: subRow.userName,
                  projectId: subRow?.id,
                  userId: subRow?.userId,
                  isBillable: subRow?.billable,
                  date: date,
                  team: subRow?.team,
                }}
                type={"billable"}
                setSubmitCount={setSubmitCount}
              />
            )}
          </div>
        );
      },
      meta: {
        className: "w-[12%]",
      },
      enableSorting: true,
      sortingFn: "alphanumeric",
    };
  });
  return createdColumns;
};

export const getDynamicColumns = (
  startDate: Date,
  billable: string,
  weekend: boolean,
  setSubmitCount: Dispatch<number>,
) => {
  const columns: ColumnDef<Assignment | any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return (
          <div
            className={`flex items-center gap-x-2 ${row.getCanExpand() || row.depth > 0 ? "" : "ml-5"} ${
              row.depth > 0
                ? "relative ml-[60px] before:absolute before:-left-7 before:-top-11 before:block  before:h-[54px] before:w-6 before:rounded-bl-md before:border-b-2 before:border-l-2 before:border-slate-300 before:-indent-[9999px] before:content-['a']"
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
            {row.depth < 1 && (
              <UserAvatar
                user={{
                  name: row.original.name ? row.original.name : "",
                  image: row.original.image ? row.original.image : "",
                }}
                className="z-10 mr-2 inline-block h-5 w-5"
              />
            )}
            <span title={row.original.title} className="cursor-default">
              {row.original.name}
            </span>
          </div>
        );
      },
      meta: {
        className: "w-[16%]",
      },
    },
    ...createDynamicColumns(startDate, billable, weekend, setSubmitCount),
  ];
  return columns;
};
