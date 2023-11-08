"use client";
import * as React from "react";
import { DataTableStructure } from "@/components/data-table-structure";
import { TableProps } from "@/types";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./toolbar";
import { Projects } from "./columns";

export function Table<TData, TValue>({ columns, data }: TableProps<Projects, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const rowClickHandler = (row: Row<Projects>) => location.assign(`projects/${row.original.id}`);

  const tableConfig = {
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  };

  return (
    <DataTableStructure
      tableConfig={tableConfig}
      DataTableToolbar={DataTableToolbar}
      // rowClickHandler={rowClickHandler}
      // rowProps={{ className: "cursor-pointer hover:bg-hover" }}
    />
  );
}
