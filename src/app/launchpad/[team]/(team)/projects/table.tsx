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
import { DataTableToolbar } from "./toolbar";
import { useCurrentUserStore } from "@/store/currentuserstore";

interface ProjectTableProps<TData, TValue> extends TableProps<TData, TValue> {
  team: string
}

export function Table<TData, TValue>({ columns, data, team }: ProjectTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const setTeam = useCurrentUserStore(state => state.setTeam)
  // const teamss = useCurrentUserStore(state => state.team)

  // console.log(teamss)

  React.useEffect(() => {
    setTeam(team)
  }, [team])

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
