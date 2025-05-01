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
import { format } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import { CreateProjectForm } from "./create-project-form";
import { Input } from "@/components/ui/input";

interface Project {
  id: number;
  name: string;
  clientId: number;
  createdAt: string;
  status: "draft" | "active" | "completed" | "cancelled";
  updatedAt: string;
  organizationId: string;
  description: string | null;
  archived: boolean;
}

interface Client {
  id: number;
  name: string;
}

const columns: ColumnDef<Project>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Project, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Project["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search projects and clients...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "clientName",
    accessorFn: (row) => row.clientId,
    header: ({ column }: { column: Column<Project, unknown> }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row, table }) => {
      const clients = (table.options.meta as { clients: Client[] }).clients;
      const client = clients.find((c) => c.id === row.getValue("clientName"));
      return <div>{client?.name || "Unknown"}</div>;
    },
    enableColumnFilter: false,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }: { column: Column<Project, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Project["status"]>()}</div>,
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Active", value: "active" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<Project, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => format(new Date(cell.getValue<Project["createdAt"]>()), "MMM d, yyyy"),
  },
];

export default function ProjectsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  const projects = useQuery({
    ...trpc.project.getAll.queryOptions(),
    placeholderData: [],
  });

  const clients = useQuery({
    ...trpc.client.getAll.queryOptions(),
    placeholderData: [],
  });

  const filteredData = useMemo(() => {
    if (!name) return projects.data || [];
    const searchTerm = name.toLowerCase();
    return (projects.data || []).filter((project) => {
      const client = (clients.data || []).find((c) => c.id === project.clientId);
      return (
        project.name.toLowerCase().includes(searchTerm) || (client?.name.toLowerCase().includes(searchTerm) ?? false)
      );
    });
  }, [projects.data, clients.data, name]);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil((filteredData.length || 0) / 20),
    meta: {
      clients: clients.data || [],
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="You can find the list of projects here">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreateProjectForm
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => projects.refetch()}
        clients={clients.data || []}
      />
    </DashboardShell>
  );
}
