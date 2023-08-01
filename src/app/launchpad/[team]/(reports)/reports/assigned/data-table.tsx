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

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TableInput } from "@/components/table-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { Assignment } from "@/types";
import { ColumnControls } from "@/components/ui/column-controls";
import { DatePicker } from "@/components/datePicker";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SingleSelectDropdown } from "@/components/ui/single-select-dropdown";
import dayjs from "dayjs";
import { Progress } from "@/components/ui/progress";

interface DataTableProps<TData, TValue> {
  team: string;
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

export function DataTable<TData, TValue>({ team }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [startDate, setStartDate] = React.useState<any>(new Date());
  const [weekend, setWeekend] = React.useState<boolean>(false);
  const [billable, setBillable] = React.useState<string>("totalTime");
  const [submitCount, setSubmitCount] = React.useState<number>(1);
  const [sortingType, setSortingType] = React.useState<{ key: number; id: string; active?: number }>({
    key: 0,
    id: "name",
  });
  const [defaultData, setDefaultData] = React.useState<TData[] | null>(null);
  const [data, setData] = React.useState<TData[]>([]);
  const [loading, setLoading] = React.useState<number>(50);

  //start date validator
  const startDateValidator = (date: string) => date && setStartDate(date);

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

  const getTotal = (obj: any, key: string) => {
    let total = 0;
    const temp: any = data.filter((project: any) => project.userId === obj.id);
    temp?.length &&
      temp?.map((arr: any) => {
        total += arr.timeAssigned[key] ? arr.timeAssigned[key][billable] : 0;
      });
    return total;
  };

  //reusable sort function
  const sortFunction = (item: any, item2: any, isUsers?: boolean) => {
    const { key, id } = sortingType;
    const t1 = isUsers ? getTotal(item, id) : item.timeAssigned[id]?.[billable];
    const t2 = isUsers ? getTotal(item2, id) : item2.timeAssigned[id]?.[billable];
    return (key === 1 ? 1 : -1) * ((t1 ? t1 : 0) - (t2 ? t2 : 0));
  };

  //function to sort rows
  const getSortedRows = () => {
    const sortedData: TData[] = [];
    let users, projects: TData[];
    users = (defaultData ? defaultData : data).filter((user: any) => !user.userName);
    projects = (defaultData ? defaultData : data).filter((user: any) => user.userName);
    if (sortingType.key !== 0 && sortingType.id !== "name")
      users = users.sort((user1: any, user2: any) => sortFunction(user1, user2, true));
    if (sortingType.key !== 0 && sortingType.id !== "name")
      projects = projects.sort((project1: any, project2: any) => sortFunction(project1, project2));
    sortingType.id === "name" ? sortingType.key === -1 && users.reverse() : users;
    sortingType.id === "name" ? sortingType.key === 1 && projects.reverse() : projects;
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
        : [...prev, rowObj?.original?.title],
    );

  const getFormatedData = (timeArr: any) => {
    const resultObj: any = {};
    for (let x in timeArr) {
      const date = new Date(x).toLocaleString("en-us", { day: "2-digit", month: "short", year: "2-digit" });
      resultObj[date] = timeArr[x];
    }
    return resultObj;
  };

  const dataFiltering = (data: any) => {
    const resultantArray: any = [];
    const notEmptyArr = data.filter((user: any) => user?.userName);
    notEmptyArr.map((user: any) => {
      const temp = {
        id: user?.userId,
        name: user?.userName.split(" ")[0],
        title: user?.userName,
        userAvatar: user?.userAvatar,
        isProjectAssigned: user?.projects?.length,
      };
      resultantArray.push(temp);
      user?.projects?.length &&
        user?.projects?.map((project: any, i: number) => {
          const temp = {
            id: project?.projectId,
            userId: user.userId,
            name: project?.projectName.slice(0, 5) + "...",
            title: project?.projectName,
            clientName: project?.clientName,
            totalTime: project?.totalTime,
            userName: user.userName,
            billable: project?.billable,
            frequency: project?.frequency,
            isFirst: i === 0 ? true : false,
            timeAssigned: getFormatedData(project?.allocations),
          };
          resultantArray.push(temp);
        });
    });
    return resultantArray;
  };

  //api call to get allocation data
  const response = async () => {
    const endDate = dayjs(startDate).add(14, "day").toDate();
    return await fetch("/api/team/allocation/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team,
        startDate,
        endDate,
        page: 1,
        pageSize: 20,
      }),
    });
  };

  React.useEffect(() => {
    setData(getSortedRows());
  }, [sortingType]);

  React.useEffect(() => {
    setLoading(80);
    response()
    .then((res) => res.json())
    .then((res) => {
        setLoading(100);
        const temp = dataFiltering(res);
        console.log(temp)
        setData(temp);
        setDefaultData(temp);
      })
      .catch((e) => console.log(e));
  }, [startDate, submitCount]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
        <div className="flex items-center gap-x-1 text-sm">
          <label>Start Date</label>
          <DatePicker date={startDate} setDate={startDateValidator} />
        </div>
        {/* weekend dropdown */}
        <SingleSelectDropdown
          selectionHandler={(value: string) => setWeekend(value === "weekend" ? true : false)}
          contentClassName="[&>div]hover:bg-hover"
          placeholder="Table view"
          selectionOptions={[
            { title: "Weekend view", value: "weekend" },
            { title: "Weekdays view", value: "weekdays" },
          ]}
          triggerClassName="w-[220px] 2xl:text-sm"
        />
        {/* time entry type dropdown */}
        <SingleSelectDropdown
          selectionHandler={(value: string) => setBillable(value)}
          contentClassName="[&>div]hover:bg-hover"
          placeholder="Entered time type"
          selectionOptions={[
            { title: "Billable", value: "billableTime" },
            { title: "Non-billable", value: "nonBillableTime" },
            { title: "Total Time", value: "totalTime" },
          ]}
          triggerClassName="w-[220px] 2xl:text-sm"
        />
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
                    className={`group flex ${!row.original.userName ? "" : "transition-all duration-300 ease-in-out"}`}
                  >
                    {row.getVisibleCells().map((cell: any, i: number) => (
                      <TableCell
                        onClick={() => i < 1 && row.original.isProjectAssigned && clickHandler(row)}
                        className={`relative inline-block h-[43px] max-h-[43px] shrink-0 grow-0 basis-[15%] cursor-default
                        px-0 py-0 tabular-nums ${
                          i < 1
                            ? row.original.userName
                              ? `inline-flex items-center before:absolute before:left-8 before:block ${
                                  row.original.isFirst ? "before:-top-0 before:h-6" : "before:-top-6 before:h-12 "
                                } before:w-4 before:rounded-bl-md before:border-b-2 before:border-l-2 before:border-slate-300 before:-indent-[9999px] before:content-['a']`
                              : `inline-flex items-center ${
                                  row.original.isProjectAssigned
                                    ? `cursor-pointer before:absolute before:left-8 ${
                                        activeRows.find((item: string) => row.original?.title === item)
                                          ? "before:block"
                                          : "before:hidden"
                                      } before:-bottom-[.5px] before:z-10 before:h-6 before:w-[2px] before:bg-slate-300`
                                    : ""
                                }`
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
                        {i > 0 ? (
                          row.original.userName ? (
                            <TableInput
                              hours={
                                row.original.timeAssigned[columns[i].accessorKey.split(".")[1]]
                                  ? row.original.timeAssigned[columns[i].accessorKey.split(".")[1]][billable]
                                  : 0
                              }
                              data={{
                                hoursObj: row.original.timeAssigned[columns[i].accessorKey.split(".")[1]],
                                userName: row.original.userName,
                                projectId: row.original.id,
                                userId: row.original.userId,
                                isBillable: row.original.billable,
                                date: columns[i].accessorKey.split(".")[1],
                                team: team,
                              }}
                              type={billable}
                              setSubmitCount={setSubmitCount}
                            />
                          ) : (
                            <span className="mx-auto flex h-full w-12 items-center justify-center">
                              {getTotal(cell.row.original, columns[i].accessorKey.split(".")[1])}
                            </span>
                          )
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger
                                className={`line-clamp-1 h-[15px] ${row.original.userName ? "relative left-14" : ""}`}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TooltipTrigger>
                              <TooltipContent>
                                <span className="rounded-sm border border-primary p-1">{cell.row.original.title}</span>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ),
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {!defaultData ? (
                  <Progress value={loading} className="border-2 border-primary bg-slate-500 w-1/3 h-4 mx-auto [&>div]:bg-green-400" />
                ) : (
                  "No results."
                )}
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
