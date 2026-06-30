"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ColumnFiltersState,
  Row,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { DataTableToolbar } from "./toolbar";
import { Client } from "@/types";
import { ClientsDataTable } from "./data-table";

export interface TableProps<TData, TValue> {
  clientName: Function;
  data: TData[];
  team: string;
}

export function Table<TData, TValue>({ clientName: getColumns, data, team }: TableProps<Client, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isEditing, setIsEditing] = React.useState<number>(0);

  const router = useRouter();
  const refInput = React.useRef<HTMLInputElement>(null);

  const noActiveProject = (row: Row<Client>) => {
    if (row.original.project === 0) {
      toast("No projects found for this client");
    }
  };

  const rowClickHandler = (row: Row<Client>) =>
    row.original.project > 0 ? router.push(`projects?clients=${row.original.id}`) : noActiveProject(row);

  const editClientNames = async (id: number, value: string) => {
    const response = await fetch("/api/team/client/edit", {
      method: "POST",
      body: JSON.stringify({
        id,
        name: value,
        team,
      }),
    });

    if (response?.ok) toast.success("Client name updated");

    router.refresh();
    setIsEditing(0);
  };

  const tableConfig = {
    data,
    columns: getColumns(editClientNames, isEditing, setIsEditing, refInput),
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
    <ClientsDataTable tableConfig={tableConfig} DataTableToolbar={DataTableToolbar} rowClickHandler={rowClickHandler} />
  );
}
