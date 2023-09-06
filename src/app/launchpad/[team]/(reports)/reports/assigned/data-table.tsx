"use client";
import { useState, useEffect } from "react";
import { DataTableStructure } from "@/components/data-table-structure";
import {
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
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { getDynamicColumns } from "./columns";

const getAllocation = async (startDate: Date) => {
  const endDate = dayjs(startDate).add(14, "day").toDate();
  const response = await fetch("/api/team/allocation/get", {
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

  if (response.ok) {
    return response.json()
  }
}

const expandingRowFilter = (row: Row<Assignment>, columnIds: string[], filterValue: string) => {
  const regex = new RegExp(filterValue, "ig");
  return regex.test(row.original.title) || regex.test(row.original.userName);
};

export function DataTable<TData>() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [startDate, setStartDate] = useState(new Date());
  const [columnVisibility, setColumnVisibility] = useState({});
  const [weekend, setWeekend] = useState<string>("weekdays");
  const [billable, setBillable] = useState<string>("totalTime");
  const { submitCount, setSubmitCount } = useSubmit();

  const mutation: UseMutationResult<TData[], unknown, Date, unknown> = useMutation(getAllocation)

  useEffect(() => {
    mutation.mutate(startDate)
  }, [startDate, submitCount])

  const tableConfig = {
    data: mutation.data as TData[],
    columns: getDynamicColumns(startDate, billable, weekend === "weekdays" ? false : true, setSubmitCount),
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

  return mutation.isSuccess ? (
    <DataTableStructure
      tableConfig={tableConfig}
      DataTableToolbar={DataTableToolbar}
      toolBarProps={{ startDate, setStartDate, setWeekend, setBillable }}
    />
  ) : (
    <TableSkeleton />
  );
}
