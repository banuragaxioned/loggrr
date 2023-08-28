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
} from "@tanstack/react-table";
import { DataTableToolbar } from "./data-toolbar";

export function DataTable<TData, TValue>({ columns, data }: TableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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

  return <DataTableStructure tableConfig={tableConfig} DataTableToolbar={DataTableToolbar} />;
}
