"use client";

import * as React from "react";
import { DataTableStructure } from "components/data-table/structure";
import { TableProps, UserGroup } from "types";
import {
  ColumnFiltersState,
  Row,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

export function Table<TData, TValue>({ columns, data }: TableProps<UserGroup, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const rowClickHandler = (row: Row<UserGroup>) => location.assign(`reports/assigned?group=${row.original.name}`);

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
      rowClickHandler={rowClickHandler}
      rowProps={{ className: "cursor-pointer hover:bg-accent" }}
    />
  );
}
