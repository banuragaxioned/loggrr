"use client";
import * as React from "react";
import { DataTableStructure } from "@/components/data-table-structure";
import { UserGroup } from "@/types";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./toolbar";
import { getColumn } from "./columns";
import { fetchResponse } from "@/lib/utils";

interface MemberTableProps<TData> {
  data: TData[];
  team: string;
  userGroup: UserGroup[];
}

export function Table<TData, TValue>({ data, team, userGroup }: MemberTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const showToast = useToast();
  const router = useRouter();

  const updateStatus = async (id: number) => {
    const body = JSON.stringify({
      team,
      userId: id,
    })

    const path = "/api/team/members/update";

    const response = await fetchResponse(path, "POST", body)

    if (response?.ok) showToast("Status Updated", "success");

    router.refresh();
  }

  const updateUserGroup = async (isSelected: boolean, options: { id: number }, id:number) => {
    const body = JSON.stringify({
      team,
      addUserGroup: isSelected ? undefined : options.id,
      removeUserGroup: isSelected ? options.id : undefined,
      userId: id
    });

    const path = "/api/team/members/usergroup/update"

    const response = await fetchResponse(path, "POST", body)

    if (response?.ok) showToast(`User ${isSelected ? 'removed from group' : 'added in group'}`, "success");

    router.refresh();
  }

  const tableConfig = {
    data,
    columns: getColumn({ updateStatus, userGroup, updateUserGroup }) as ColumnDef<TData, TValue>[],
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
