"use client";
import { useState, useEffect, Dispatch } from "react";
import { DataTableStructure } from "@/components/data-table-structure";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  ExpandedState,
  getExpandedRowModel,
  getSortedRowModel,
  Row,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./toolbar";
import dayjs from "dayjs";
import { useSubmit } from "@/hooks/useSubmit";
import { AllocationDetails, Assignment } from "@/types";
import { TableSkeleton } from "@/components/data-table-skeleton";

interface AssignmentTableProps<TData, TValue> {
  columns: (
    startDate: Date,
    billable: string,
    weekend: boolean,
    setSubmitCount: Dispatch<number>,
  ) => ColumnDef<TData, TValue>[];
}

const expandingRowFilter = (row: Row<Assignment>, columnIds: string[], filterValue: string) => {
  const regex = new RegExp(filterValue, "ig");
  return regex.test(row.original.title) || regex.test(row.original.userName);
};

export function DataTable<TData, TValue>({ columns }: AssignmentTableProps<Assignment, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [startDate, setStartDate] = useState(new Date());
  const [columnVisibility, setColumnVisibility] = useState({});
  const [data, setData] = useState([]);
  const [weekend, setWeekend] = useState<string>("weekdays");
  const [billable, setBillable] = useState<string>("totalTime");
  const { submitCount, setSubmitCount } = useSubmit();
  const [initialLoad, setInitialLoad] = useState<boolean>(false);

  const rowClickHandler = (row: Row<Assignment>) => row.depth < 1 && row.toggleExpanded();

  const tableConfig = {
    data,
    columns: columns(startDate, billable, weekend === "weekdays" ? false : true, setSubmitCount),
    state: {
      sorting,
      expanded,
      columnVisibility,
    },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: { subRows: AllocationDetails }) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    paginateExpandedRows: false,
    filterFromLeafRows: true,
    filterFns: { expandingRowFilter },
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  };

  //api call to get allocation data
  const getAllocation = async () => {
    const endDate = dayjs(startDate).add(14, "day").toDate();
    return await fetch("/api/team/allocation/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: "axioned",
        startDate,
        endDate,
        page: 1,
        pageSize: 20,
      }),
    });
  };
  useEffect(() => {
    getAllocation()
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((e) => setData([]))
      .finally(() => !initialLoad && setInitialLoad(true));
  }, [startDate, submitCount]);

  return initialLoad ? (
    <DataTableStructure
      tableConfig={tableConfig}
      DataTableToolbar={DataTableToolbar}
      toolBarProps={{ startDate, setStartDate, setWeekend, setBillable }}
      rowClickHandler={rowClickHandler}
    />
  ) : (
    <TableSkeleton />
  );
}
