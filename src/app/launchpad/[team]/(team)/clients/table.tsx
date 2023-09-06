"use client";

import * as React from "react";
import { DataTableStructure } from "@/components/data-table-structure";
import { TableProps } from "@/types";
import {
  ColumnFiltersState,
  Row,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./toolbar";
import { Client } from "./columns";

export function Table<TData, TValue>({ columns, data }: TableProps<Client, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const rowClickHandler = (row: Row<Client>) => location.assign(`projects?client=${row.original.name}`);

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
      rowClickHandler={rowClickHandler}
      rowProps={{ className: "cursor-pointer hover:bg-hover" }}
    />
  );
}
