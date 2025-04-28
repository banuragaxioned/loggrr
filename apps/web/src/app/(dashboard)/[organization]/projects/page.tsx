"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { useDataTable } from "@/hooks/use-data-table";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { DashboardHeader, DashboardShell } from "@/components/shell";

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
    header: "Name",
    meta: {
      label: "Name",
      placeholder: "Search by name...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "clientName",
    accessorFn: (row) => row.clientId,
    header: "Client",
    cell: ({ row, table }) => {
      const clients = (table.options.meta as { clients: Client[] }).clients;
      const client = clients.find((c) => c.id === row.getValue("clientName"));
      return client?.name || "Unknown";
    },
    meta: {
      label: "Client",
      placeholder: "Search by client...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
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
];

export default function LoggedPage() {
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const projects = useQuery({
    ...trpc.project.getAll.queryOptions(),
    placeholderData: [],
  });

  const clients = useQuery({
    ...trpc.client.getAll.queryOptions(),
    placeholderData: [],
  });

  const createMutation = useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: () => {
        projects.refetch();
        setNewProjectName("");
        setSelectedClient("");
        setIsOpen(false);
      },
    }),
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() && selectedClient) {
      createMutation.mutate({
        name: newProjectName,
        clientId: parseInt(selectedClient),
      });
    }
  };

  const { table } = useDataTable({
    data: projects.data || [],
    columns,
    pageCount: Math.ceil((projects.data?.length || 0) / 10),
    meta: {
      clients: clients.data || [],
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="You can find the list of projects here">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <form onSubmit={handleCreateProject} className="space-y-4">
              <SheetHeader>
                <SheetTitle>Create New Project</SheetTitle>
                <SheetDescription>Create a new project to start tracking time.</SheetDescription>
              </SheetHeader>
              <div className="p-4 space-y-4">
                <div>
                  <label htmlFor="client">Client</label>
                  <Select value={selectedClient} onValueChange={setSelectedClient} disabled={createMutation.isPending}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.data?.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="project-name">Project Name</label>
                  <Input
                    id="project-name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    disabled={createMutation.isPending}
                  />
                </div>
              </div>

              <SheetFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || !newProjectName.trim() || !selectedClient}
                >
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Project"}
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableAdvancedToolbar table={table}>
          <DataTableFilterList table={table} />
          <DataTableSortList table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
    </DashboardShell>
  );
}
