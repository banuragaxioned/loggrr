"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { useDateState } from "@/hooks/useDate";
import { ArrowUpDown } from "lucide-react";
import { Assignment } from "@/types";

import * as React from "react";
import { DatePicker } from "@/components/datePicker";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  data: TData[];
}

//function to get date between two dates
const getDatesInRange = (startDate: any, endDate: any) => {
  const dates = [];
  let start = startDate,
    end = endDate;
  while (start <= end) {
    const currentDate = new Date(start);
    currentDate.getDay() !== 0 &&
      currentDate.getDay() !== 6 &&
      dates.push({
        date: currentDate.getDate(),
        month: currentDate.toLocaleString("en-us", { month: "short" }),
        day: currentDate.toLocaleString("en-us", { weekday: "short" }),
        dateKey: start,
      });
    start = new Date(start).setDate(new Date(start).getDate() + 1);
  }
  return dates;
};

export function DataTable<TData, TValue>({ data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const { startDate, setStartDate, endDate, setEndDate }: any = useDateState();
  const [colums, setColumns] = React.useState<ColumnFiltersState>([]);

  //function to create dynamic columns based on dates
  const getDynamicColumns = () => {
    const endDate = new Date().setDate(new Date(startDate).getDate() + 7);
    return getDatesInRange(Date.parse(startDate), endDate).map((dateObj) => {
      return {
        accessorKey: `time.${dateObj.dateKey}.totalTime`,
        header: ({}) => {
          return (
            <Button variant="link" className="text-slate-500">
              {`${dateObj.date} ${dateObj.month} ${dateObj.day}`}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      };
    });
  };

  //shadcn modified colums array to create columns
  const columns: ColumnDef<Assignment>[] | any = [
    {
      accessorKey: "name",
      header: ({ column }: any) => {
        return (
          <Button variant="link" className="text-slate-500">
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    ...getDynamicColumns(),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const [activeRows, setActiveRows] = React.useState([]);

  const isVisible = (rowObj: any) =>
    activeRows?.find((item) => item === rowObj.original.userName) || !rowObj.original.userName;

  const clickHandler = (rowObj: any) =>
    !rowObj?.original?.userName &&
    setActiveRows((prev: any) =>
      prev?.find((item: string) => rowObj?.original?.name === item)
        ? prev?.filter((item: string) => item !== rowObj?.original?.name)
        : [...prev, rowObj?.original?.name]
    );

  React.useEffect(() => {
    setStartDate(new Date())
    setColumns(columns);
  }, [startDate, endDate,[]]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
        <div className="flex items-center gap-x-1 text-sm">
          <label>Start Date</label>
          <DatePicker date={startDate} setDate={setStartDate} />
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(
              (row: any) =>
                isVisible(row) && (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => clickHandler(row)}
                    className={!row.original.userName ? "cursor-pointer" : "transition-all duration-300 ease-in-out"}
                  >
                    {row.getVisibleCells().map((cell: any, i: number) => (
                      <TableCell
                        className={`h-[43px] max-h-[43px] px-0 py-0 tabular-nums ${
                          i < 1
                            ? row.original.userName
                              ? "relative pl-8 indent-14 before:absolute before:-top-6 before:left-14 before:block before:h-[46px] before:w-6 before:rounded-bl-md before:border-b-2 before:border-l-2 before:border-slate-300 before:-indent-[9999px] before:content-['a']"
                              : "line-clamp-1 flex pl-8 items-center"
                            : ""
                        }`}
                        key={cell.id}
                      >
                        {i < 1 && !cell.row.original.userName && (
                          <>
                            {activeRows.find((item) => item === cell.row.original?.name) ? (
                              <ChevronDown className="h-4 w-4 block stroke-slate-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 block stroke-slate-600" />
                            )}
                            <UserAvatar
                              user={{ name: cell.row.original.name, image: cell.row.original.userAvatar }}
                              className="z-10 mr-2 inline-block h-5 w-5"
                            />
                          </>
                        )}
                        <span className="line-clamp-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
