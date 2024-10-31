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
    // Define role hierarchy and permissions
    const isOwner = userRole === Role.OWNER;
    const isManager = userRole === Role.MANAGER;
    const isPromotingToOwner = role === Role.OWNER;

    // Early return for insufficient permissions
    if (!isOwner && !isManager) {
      toast.error("You need to be a manager or owner to update role.");
      return;
    }

    // Check promotion restrictions
    if (isManager && isPromotingToOwner) {
      toast.error("Only owners can promote someone to owner.");
      return;
    }

    // Check if trying to modify an owner's role
    if (selectedUserRole === Role.OWNER && !isOwner) {
      toast.error("Only owners can modify other owners' roles.");
      return;
    }

    try {
      const response = await fetch("/api/team/members/update-role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team, userId: id, role }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      toast.success(`${name ?? "User"} is now ${role}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update role");
    }
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
