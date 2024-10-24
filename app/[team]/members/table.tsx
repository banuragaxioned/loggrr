"use client";
import * as React from "react";
import { DataTableStructure } from "@/components/data-table/structure";
import { UserGroup } from "@/types";
import { toast } from "sonner";
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
import { Role } from "@prisma/client";

interface MemberTableProps<TData> {
  data: TData[];
  team: string;
  userGroup: UserGroup[];
  userRole: Role;
}

export function Table<TData, TValue>({ data, team, userGroup, userRole }: MemberTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const router = useRouter();

  const updateStatus = async (id: number, role: string, name?: string, selectedUserRole?: string) => {
    const canUpdateRole = userRole === Role.OWNER || userRole === Role.MANAGER;
    const canUpdateOwner = canUpdateRole && (selectedUserRole !== Role.OWNER || userRole === selectedUserRole);

    if (!canUpdateRole) {
      toast.message("You need to be a manager or owner to update role.");
      return;
    }

    if (!canUpdateOwner) {
      toast.message("You need to be an owner to update role.");
      return;
    }

    const response = await fetch("/api/team/members/update-role", {
      method: "PUT",
      body: JSON.stringify({
        team,
        userId: id,
        role,
      }),
    });

    if (response.ok) toast.success(`${name} is now ${role}`);

    router.refresh();
  };

  const updateUserGroup = async (options: { id: number }[], userId: number) => {
    const response = await fetch("/api/team/members/usergroup/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team,
        groups: options,
        userId: userId,
      }),
    });

    if (response.ok) toast.success("User group updated");

    router.refresh();
  };

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
