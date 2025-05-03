"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { DashboardHeader, DashboardShell } from "@/components/shell";
import { parseAsString, useQueryState } from "nuqs";
import { CreateSkillForm } from "./create-skill-form";

interface Skill {
  id: number;
  name: string;
  description: string | null;
}

const columns: ColumnDef<Skill>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Skill, unknown> }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ cell }) => <div>{cell.getValue<Skill["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search skills...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "description",
    accessorKey: "description",
    header: ({ column }: { column: Column<Skill, unknown> }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Skill["description"]>()}</div>,
    meta: {
      label: "Description",
      placeholder: "Search descriptions...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
];

export default function SkillsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  const skills = useQuery({
    ...trpc.skill.getAll.queryOptions(),
    placeholderData: [],
  });

  const filteredData = useMemo(() => {
    if (!name) return skills.data || [];
    const searchTerm = name.toLowerCase();
    return (skills.data || []).filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchTerm) ||
        (skill.description?.toLowerCase().includes(searchTerm) ?? false),
    );
  }, [skills.data, name]);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil((filteredData.length || 0) / 20),
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Skills" text="You can find the list of skills here">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Skill
        </Button>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreateSkillForm open={isOpen} onOpenChange={setIsOpen} onSuccess={() => skills.refetch()} />
    </DashboardShell>
  );
}
