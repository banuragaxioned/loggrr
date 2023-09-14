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
}

export function DataTable<TData, TValue>({ skills }: MemberTableProps<SkillsList>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const showToast = useToast();
  const router = useRouter();

  const editSkillNames = async (id: number, name: string) => {
    const response = await fetch("/api/team/skill/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       id, 
       name,
      }),
    });

    if (response?.ok) showToast("Member removed", "success");

    router.refresh();
  };

  const tableConfig = {
    data: skills,
    columns: skillName(editSkillNames),
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
