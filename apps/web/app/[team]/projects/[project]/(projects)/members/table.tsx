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

  const router = useRouter();

  const removeMember = async (id: number) => {
    const response = await fetch("/api/team/project/members", {
      method: "DELETE",
      body: JSON.stringify({ team, id, projectId: +projectId }),
    });

    if (response.ok) toast.success("User deleted successfully");

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
      className="group cursor-pointer hover:bg-accent"
    />
  );
}
