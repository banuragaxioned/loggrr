"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { DataTableToolbar } from "./toolbar";
import { getColumns } from "./columns";
import { GroupRow, GroupsDataTable } from "./data-table";
import { deleteGroup, updateGroup } from "@/app/_actions/create-group-action";

interface GroupsTableProps {
  data: GroupRow[];
  team: string;
  canManage: boolean;
}

export function Table({ data, team, canManage }: GroupsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isEditing, setIsEditing] = React.useState(0);

  const router = useRouter();
  const refInput = React.useRef<HTMLInputElement>(null);

  const editGroupName = async (id: number, name: string) => {
    if (!canManage) {
      toast.error("Only owners and managers can rename groups.");
      return;
    }

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error("Group name must be at least 2 characters");
      return;
    }

    const result = await updateGroup(team, id, trimmed);
    if (result.success) {
      toast.success("Group renamed");
      router.refresh();
      setIsEditing(0);
      return;
    }

    toast.error("Failed to rename group");
  };

  const handleDeleteGroup = async (id: number, memberCount: number) => {
    if (!canManage) {
      toast.error("Only owners and managers can delete groups.");
      return;
    }

    if (memberCount > 0) {
      toast.error("You must move members to a different group before deleting.");
      return;
    }

    const result = await deleteGroup(team, id);
    if (result.success) {
      toast.success("Group deleted");
      router.refresh();
      return;
    }

    if ("hasMembers" in result && result.hasMembers) {
      toast.error("You must move members to a different group before deleting.");
      return;
    }

    toast.error("Failed to delete group");
  };

  const rowClickHandler = (row: Row<GroupRow>) => {
    if (isEditing !== 0) return;

    router.push(`/${team}/members?group=${row.original.id}`);
  };

  const tableConfig = {
    data,
    columns: getColumns({
      isEditing,
      setIsEditing,
      refInput,
      editGroupName,
      deleteGroup: handleDeleteGroup,
      canManage,
    }),
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
    <GroupsDataTable tableConfig={tableConfig} DataTableToolbar={DataTableToolbar} rowClickHandler={rowClickHandler} />
  );
}
