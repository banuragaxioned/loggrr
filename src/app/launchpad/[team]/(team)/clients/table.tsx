"use client";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import { TableProps } from "@/types";
import { SortingState, getSortedRowModel } from "@tanstack/react-table";

export function Table<TData, TValue>({ columns, data }: TableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const tableConfig = {
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  };

  return <DataTable tableConfig={tableConfig} />;
}
