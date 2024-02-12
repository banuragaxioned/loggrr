"use client";
import * as React from "react";
import { DataTableStructure } from "@/components/data-table/structure";
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
import { toast } from "sonner";
import { Users, getColumn } from "./columns";
import { useRouter } from "next/navigation";

interface MemberTableProps<TData> {
  data: TData[];
  team: string;
  projectId: number;
}

export function Table<TData, TValue>({ data, team, projectId }: MemberTableProps<Users>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const rowClickHandler = (row: Row<Users>) => location.assign(`member/${row.original.id}`);

  const router = useRouter();

  const removeMember = async (userId: number) => {
    const response = await fetch("/api/team/project/members/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ team, userId, projectId}),
    });

    console.log(response);
    if (response.ok) toast.success("User removed");

    router.refresh();  
  };

  const tableConfig = {
    data,
    columns: getColumn({ removeMember }),
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
