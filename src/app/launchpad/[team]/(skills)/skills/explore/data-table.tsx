"use client";
import * as React from "react";
import { DataTableStructure } from "@/components/data-table-structure";
import { TableProps } from "@/types";
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
import { SkillsList, skillName } from "./columns";

interface MemberTableProps<TData> {
  skills: TData[];
  team: string;
}

export interface SkillUpdate {
  id: number,
  updatedValue: string
}

export function DataTable<TData, TValue>({ skills, team }: MemberTableProps<SkillsList>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isEditing, setIsEditing] = React.useState<SkillUpdate>({ id: 0, updatedValue: ''});
  const showToast = useToast();
  const router = useRouter();

  const editSkillNames = async () => {
    
    const response = await fetch("/api/team/skill/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       id: isEditing.id, 
       name: isEditing.updatedValue,
       team,
      }),
    });

    if (response?.ok) showToast("Skill updated", "success");

    router.refresh();
  };

  const tableConfig = {
    data: skills,
    columns: skillName(editSkillNames, isEditing, setIsEditing),
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
