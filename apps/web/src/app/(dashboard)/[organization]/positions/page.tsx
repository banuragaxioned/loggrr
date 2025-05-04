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
import { CreatePositionForm } from "./create-position-form";

interface Position {
  id: number;
  name: string;
  description: string | null;
}

const columns: ColumnDef<Position>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Position, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Position["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search positions...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "description",
    accessorKey: "description",
    header: ({ column }: { column: Column<Position, unknown> }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Position["description"]>()}</div>,
    meta: {
      label: "Description",
      placeholder: "Search descriptions...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
];

export default function PositionsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  const positions = useQuery({
    ...trpc.position.getAll.queryOptions(),
    placeholderData: [],
  });

  const filteredData = useMemo(() => {
    if (!name) return positions.data || [];
    const searchTerm = name.toLowerCase();
    return (positions.data || []).filter(
      (position) =>
        position.name.toLowerCase().includes(searchTerm) ||
        (position.description?.toLowerCase().includes(searchTerm) ?? false),
    );
  }, [positions.data, name]);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil((filteredData.length || 0) / 20),
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Positions" text="You can find the list of positions here">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Position
        </Button>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreatePositionForm open={isOpen} onOpenChange={setIsOpen} onSuccess={() => positions.refetch()} />
    </DashboardShell>
  );
}
