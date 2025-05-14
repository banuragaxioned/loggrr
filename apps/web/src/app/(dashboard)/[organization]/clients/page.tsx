"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { DashboardHeader, DashboardShell } from "@/components/shell";
import { format } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import { CreateClientForm } from "./create-client-form";

interface Client {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const columns: ColumnDef<Client>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Client, unknown> }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ cell }) => <div>{cell.getValue<Client["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search by name...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<Client, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => format(new Date(cell.getValue<Client["createdAt"]>()), "MMM d, yyyy"),
  },
];

export default function ClientsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  const clients = useQuery({
    ...trpc.client.getAll.queryOptions(),
    placeholderData: [],
  });

  const filteredData = useMemo(() => {
    if (!name) return clients.data || [];
    return (clients.data || []).filter((client) => client.name.toLowerCase().includes(name.toLowerCase()));
  }, [clients.data, name]);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil((filteredData.length || 0) / 20),
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Clients" text="You can find the list of clients here">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreateClientForm open={isOpen} onOpenChange={setIsOpen} onSuccess={() => clients.refetch()} />
    </DashboardShell>
  );
}
