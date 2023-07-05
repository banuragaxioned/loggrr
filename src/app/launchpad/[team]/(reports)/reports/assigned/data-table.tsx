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
import { Assignment } from "@/types";

import * as React from "react";
import { DatePicker } from "@/components/datePicker";
import { ChevronDown, ChevronRight, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  data: TData[];
}

//function to get date between two dates
const getDatesInRange = (startDate: any, endDate: any, includeWeekend: boolean) => {
  const dates = [];
  let start = startDate,
    end = endDate;
  while (start <= end) {
    const currentDate = new Date(start);
    (includeWeekend ? true : currentDate.getDay() !== 0 && currentDate.getDay() !== 6) &&
      dates.push({
        date: currentDate.getDate(),
        month: currentDate.toLocaleString("en-us", { month: "short" }),
        day: currentDate.toLocaleString("en-us", { weekday: "short" }),
        dateKey: currentDate.toLocaleString("en-us", { day: "2-digit", month: "short", year: "2-digit" }),
      });
    start = new Date(start).setDate(new Date(start).getDate() + 1);
  }
  return dates;
};

export function DataTable<TData, TValue>({ data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [startDate, setStartDate]= React.useState<any>();
  const [colums, setColumns] = React.useState<ColumnFiltersState>([]);
  const [weekend, setWeekend] = React.useState<boolean>(false);
  const [billable, setBillable] = React.useState<string>("totalTime");

  //function to create dynamic columns based on dates
  const getDynamicColumns = () => {
    const days = 8;
    const endDate = new Date(new Date(startDate).getTime() + 86400000 * days);
    return getDatesInRange(Date.parse(startDate), endDate, weekend).map((dateObj) => {
      return {
        accessorKey: `timeAssigned.${dateObj.dateKey}.${billable}`,
        header: ({}) => {
          return (
            <Button variant="link" className="shrink-0 grow-0 px-0  text-slate-500">
              <p className="flex flex-col items-center justify-center">
                <span>{`${dateObj.date} ${dateObj.month}`}</span>
                <span>{dateObj.day}</span>
              </p>
              <ChevronsUpDown className="h-4 w-4" />
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
            <ChevronsUpDown className="h-4 w-4" />
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
      prev?.find((item: string) => rowObj?.original?.fullName === item)
        ? prev?.filter((item: string) => item !== rowObj?.original?.fullName)
        : [...prev, rowObj?.original?.fullName]
    );

  React.useEffect(() => {
    setColumns(columns);
  }, [startDate]);

  React.useEffect(() => {
    setStartDate(new Date());
  }, []);

  return (
    <div>
      <div className="mb-3 flex items-center gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
        <div className="flex items-center gap-x-1 text-sm">
          <label>Start Date</label>
          <DatePicker date={startDate} setDate={setStartDate} />
        </div>
        {/* weekend dropdown */}
        <Select onValueChange={(value) => setWeekend(value === "weekend" ? true : false)}>
          <SelectTrigger className="w-[220px] 2xl:text-sm">
            <SelectValue placeholder="Weekend/Weekdays" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="p-[5px]">
              <SelectItem value="weekend">
                <SelectItemText value="weekend">weekend</SelectItemText>
              </SelectItem>
              <SelectItem value="weekdays">
                <SelectItemText value="">weekdays</SelectItemText>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* time entry type dropdown */}
        <Select onValueChange={(value) => setBillable(value)}>
          <SelectTrigger className="w-[220px] 2xl:text-sm">
            <SelectValue placeholder="Entered time type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="p-[5px]">
              <SelectItem value="billableTime">
                <SelectItemText value="billableTime">Billable</SelectItemText>
              </SelectItem>
              <SelectItem value="nonBillableTime">
                <SelectItemText value="">Non-billable</SelectItemText>
              </SelectItem>
              <SelectItem value="totalTime">
                <SelectItemText value="">Total Time</SelectItemText>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="flex">
              {headerGroup.headers.map((header, i) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`inline-flex shrink-0 grow-0 items-center justify-center  font-normal ${
                      i > 0
                        ? `px-0 ${weekend ? "basis-[9.5%]" : "basis-[12%]"}`
                        : ` px-0 ${weekend ? "basis-[10%]" : "basis-[15%]"}`
                    }`}
                  >
                    <span className="flex">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
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
                    onClick={() => row.original.isProjectAssigned && clickHandler(row)}
                    className={`flex ${
                      !row.original.userName ? "cursor-pointer" : "transition-all duration-300 ease-in-out"
                    }`}
                  >
                    {row.getVisibleCells().map((cell: any, i: number) => (
                      <TableCell
                        className={`inline-block h-[43px] max-h-[43px] shrink-0 grow-0 ${
                          weekend ? "basis-[11%]" : " basis-[15%]"
                        } px-0 py-0 tabular-nums ${
                          i < 1
                            ? row.original.userName
                              ? "relative inline-flex items-center before:absolute before:-top-6 before:left-8 before:block before:h-[46px] before:w-4 before:rounded-bl-md before:border-b-2 before:border-l-2 before:border-slate-300 before:-indent-[9999px] before:content-['a']"
                              : "inline-flex items-center"
                            : `${weekend ? "basis-[9.5%]" : "basis-[12%]"}`
                        }`}
                        key={cell.id}
                      >
                        {i < 1 && !cell.row.original.userName && (
                          <>
                            {activeRows.find((item) => item === cell.row.original?.name) ? (
                              <ChevronDown className={`block h-4 w-4 ml-2 shrink-0 stroke-slate-500`} />
                            ) : (
                              <ChevronRight
                                className={`block h-4 w-4 shrink-0 ml-2 ${
                                  row.original.isProjectAssigned ? "stroke-slate-500 " : "stroke-muted"
                                }`}
                              />
                            )}
                            <UserAvatar
                              user={{ name: cell.row.original.name, image: cell.row.original.userAvatar }}
                              className="z-10 mr-2 inline-block h-5 w-5"
                            />
                          </>
                        )}
                        <span
                          className={
                            i < 1 ? `line-clamp-1 h-[15px] cursor-default ${row.original.userName ? "relative left-14":"" }` : "flex h-full items-center justify-center"
                          }
                          title={i < 1 ? cell.row.original.fullName || cell.row.original.name : null}
                        >
                          {i > 0 && !cell.row.original.timeAssigned[columns[i].accessorKey.split(".")[1]]
                            ? 0
                            : flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
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
