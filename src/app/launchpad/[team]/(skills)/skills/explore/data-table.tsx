"use client";
import * as React from "react";
import { DataTableStructure } from "@/components/data-table-structure";
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
import { useRef } from "react";

interface MemberTableProps<TData> {
  skills: TData[];
  team: string;
}

export interface SkillUpdate {
  id: number;
  updatedValue: string;
}

export function DataTable<TData, TValue>({ skills, team }: MemberTableProps<SkillsList>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isEditing, setIsEditing] = React.useState<number>(0);
  const showToast = useToast();
  const router = useRouter();

  const refButton = useRef<HTMLButtonElement>(null);

  const editSkillNames = async (id: number, value: string) => {
    const response = await fetch("/api/team/skill/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        name: value,
        team,
      }),
    });

    if (response?.ok) showToast("Skill updated", "success");

    router.refresh();
    setIsEditing(0);
  };

  const deleteSkillNames = async (id: number) => {
    const response = await fetch("/api/team/skill/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        team,
      }),
    });

    if (response?.ok) showToast("Skill deleted", "success");

    router.refresh();
  };

  const tableConfig = {
    data: skills,
    columns: skillName(editSkillNames, isEditing, setIsEditing, refButton, deleteSkillNames),
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
