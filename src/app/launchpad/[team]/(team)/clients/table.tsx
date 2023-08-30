"use client";

import * as React from "react";
import { DataTableStructure } from "@/components/data-table-structure";
import { TableProps } from "@/types";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./toolbar";
import { useClientStore } from "@/store/clientStore";

interface ClientTableProps<TData, TValue> {
  team: string
  columns: ColumnDef<TData, TValue>[]
}

export function Table<TData, TValue>({ columns, team }: ClientTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [data, fetchClients] = useClientStore(state => [state.clients, state.fetch])

  React.useEffect(() => {
    if (data.length < 0) fetchClients(team)
  }, [])

  const tableConfig = {
    data: data as TData[],
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
