"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { DataTableStructure } from "@/components/data-table/structure";
import { DataTableToolbar } from "./toolbar";
import { Client } from "@/types";

export interface TableProps<TData, TValue> {
  clientName: Function;
  data: TData[];
  team: string;
}

export function Table<TData, TValue>({ clientName, data, team }: TableProps<Client, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isEditing, setIsEditing] = React.useState<number>(0);

  const router = useRouter();

  const refButton = React.useRef<HTMLButtonElement>(null);

  const noActiveProject = (row: Row<Client>) => {
    if (row.original.project === 0) {
      toast("No Projects found in this client");
    }
  };

  const rowClickHandler = (row: Row<Client>) =>
    row.original.project > 0 ? router.push(`projects?client=${row.original.name}`) : noActiveProject(row);

  const editClientNames = async (id: number, value: string) => {
    const response = await fetch("/api/team/client/edit", {
      method: "POST",
      body: JSON.stringify({
        id: id,
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
    columns: clientName(editClientNames, isEditing, setIsEditing, refButton),
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
      rowProps={{ className: "cursor-pointer group hover:bg-accent" }}
    />
  );
}
