"use client";

import * as React from "react";
import { DataTableStructure } from "@/components/data-table/structure";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./toolbar";
import { getColumn } from "./columns";

interface MemberTableProps<TData> {
  data: TData[];
}

export function Table<TData, TValue>({ data }: MemberTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const tableConfig = {
    data,
    columns: getColumn() as ColumnDef<TData, TValue>[],
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      fuzzy: (row: Row<TData>, columnId: string, filterValue: string) => {
        const user = row.getValue(columnId) as { name: string | null };
        return user.name?.toLowerCase().includes(filterValue.toLowerCase()) ?? false;
      },
    },
  };

  return <DataTableStructure tableConfig={tableConfig} DataTableToolbar={DataTableToolbar} />;
}
