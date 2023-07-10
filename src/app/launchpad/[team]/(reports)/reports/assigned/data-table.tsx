"use client";

import * as React from "react";
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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {TableInput} from "@/components/table-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { Assignment } from "@/types";
import { ColumnControls } from "@/components/ui/column-controls";
import {Input} from "@/components/ui/input";
import { DatePicker } from "@/components/datePicker";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface DataTableProps<TData, TValue> {
  tableData: TData[];
}

//function to get date between two dates
const getDatesInRange = (startDate: any, days: number, includeWeekend: boolean) => {
  const dates = [];
  let start = startDate,
    count = 0;
  while (count < days) {
    const currentDate = new Date(start);
    if (includeWeekend ? true : currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      dates.push({
        date: currentDate.getDate(),
        month: currentDate.toLocaleString("en-us", { month: "short" }),
        day: currentDate.toLocaleString("en-us", { weekday: "short" }),
        dateKey: currentDate.toLocaleString("en-us", { day: "2-digit", month: "short", year: "2-digit" }),
      });
      count++;
    }
    start = new Date(start).setDate(new Date(start).getDate() + 1);
  }
  return dates;
};

export function DataTable<TData, TValue>({ tableData }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [startDate, setStartDate] = React.useState<any>(new Date());
  const [weekend, setWeekend] = React.useState<boolean>(false);
  const [billable, setBillable] = React.useState<string>("totalTime");
  const [sortingType, setSortingType] = React.useState<{ key: number; id: string; active?: number }>({
    key: 0,
    id: "name",
  });
  const [data, setData] = React.useState<TData[]>(tableData);

  //function to create dynamic columns based on dates
  const getDynamicColumns = () => {
    const days = 7;
    return getDatesInRange(Date.parse(startDate), days, weekend).map((dateObj, i) => {
      return {
        accessorKey: `timeAssigned.${dateObj.dateKey}.${billable}`,
        header: ({}) => {
          return (
            <ColumnControls setSortingType={setSortingType} sortingType={sortingType} id={dateObj.dateKey} index={i++}>
              <p className="flex flex-col items-center justify-center gap-y-1">
                <span>{`${dateObj.date} ${dateObj.month}`}</span>
                <span>{dateObj.day}</span>
              </p>
            </ColumnControls>
          );
        },
      };
    });
  };

  //reusable sort function
  const sortFunction = (item: any, item2: any) => {
    const { key, id } = sortingType;
    const t1 = id === "name" || key === 0 ? item.title : item.timeAssigned[id]?.[billable];
    const t2 = id === "name" || key === 0 ? item.title : item2.timeAssigned[id]?.[billable];
    return (key === 1 ? 1 : -1) * ((t1 ? t1 : 0) - (t2 ? t2 : 0));
  };

  //function to sort rows
  const getSortedRows = () => {
    const sortedData: TData[] = [];
    let users, projects: TData[];
    users = tableData.filter((user: any) => !user.userName);
    projects = tableData.filter((user: any) => user.userName);
    users = users.sort((user1: any, user2: any) => sortFunction(user1, user2));
    projects = projects.sort((project1: any, project2: any) => sortFunction(project1, project2));
    sortingType.id === "name" && sortingType.key === -1 && users.reverse();
    sortingType.id === "name" && sortingType.key === 1 && projects.reverse();
    users.map((user: any) => {
      const userprojects = projects.filter((project: any) => project.userName === user.title);
      sortedData.push(user);
      userprojects.length > 0 && sortedData.push(...userprojects);
    });
    return sortedData;
  };

  //shadcn modified colums array to create columns
  const columns: ColumnDef<Assignment>[] | any = [
    {
      accessorKey: "name",
      header: ({ column }: any) => {
        return (
          <ColumnControls setSortingType={setSortingType} sortingType={sortingType} id="name">
            <span>Name</span>
          </ColumnControls>
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
      prev?.find((item: string) => rowObj?.original?.title === item)
        ? prev?.filter((item: string) => item !== rowObj?.original?.title)
        : [...prev, rowObj?.original?.title]
    );

  React.useEffect(() => {
    setData(getSortedRows());
  }, [sortingType]);

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
            <SelectValue placeholder="Table view" />
          </SelectTrigger>
          <SelectContent className="[&>div]hover:bg-hover">
            <SelectGroup className="p-[5px]">
              <SelectItem value="weekend">
                <SelectItemText value="weekend">Weekend view</SelectItemText>
              </SelectItem>
              <SelectItem value="weekdays">
                <SelectItemText value="">Weekdays view</SelectItemText>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* time entry type dropdown */}
        <Select onValueChange={(value) => setBillable(value)}>
          <SelectTrigger className="w-[220px] 2xl:text-sm">
            <SelectValue placeholder="Entered time type" />
          </SelectTrigger>
          <SelectContent className="[&>div]hover:bg-hover">
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
                      i > 0 ? "basis-[12%] px-0" : "basis-[15%] px-0"
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
                    className={`group flex ${
                      !row.original.userName ? "" : "transition-all duration-300 ease-in-out"
                    }`}
                  >
                    {row.getVisibleCells().map((cell: any, i: number) => (
                      <TableCell
                      onClick={() => i<1 && row.original.isProjectAssigned && clickHandler(row)}
                        className={`inline-block cursor-default h-[43px] max-h-[43px] shrink-0 grow-0 basis-[15%]
                        px-0 py-0 tabular-nums ${
                          i < 1
                            ? row.original.userName
                              ? "relative inline-flex items-center before:absolute before:-top-6 before:left-8 before:block before:h-12 before:w-4 before:rounded-bl-md before:border-b-2 before:border-l-2 before:border-slate-300 before:-indent-[9999px] before:content-['a']"
                              : `inline-flex items-center ${row.original.isProjectAssigned? "cursor-pointer" : ""}`
                            : "basis-[12%]"
                        }`}
                        key={cell.id}
                      >
                        {i < 1 && !cell.row.original.userName && (
                          <>
                            {activeRows.find((item) => item === cell.row.original?.name) ? (
                              <ChevronDown className={`ml-2 block h-4 w-4 shrink-0 stroke-slate-500`} />
                            ) : (
                              <ChevronRight
                                className={`ml-2 block h-4 w-4 shrink-0 ${
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
                          {i > 0 ?
                        <TableInput hours={cell.row.original.timeAssigned[columns[i].accessorKey.split(".")[1]] ? cell.row.original.timeAssigned[columns[i].accessorKey.split(".")[1]][billable] : 0 }/>
                          :
                            <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className={`line-clamp-1 h-[15px] ${
                                  row.original.userName ? "relative left-14" : ""
                                }`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TooltipTrigger>
                              <TooltipContent>
                                <span className="border border-primary p-1 rounded-sm">{cell.row.original.title}</span>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          }
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
