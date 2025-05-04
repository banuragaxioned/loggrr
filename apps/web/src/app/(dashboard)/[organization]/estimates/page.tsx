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
import { CreateEstimateForm } from "./create-estimate-form";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Estimate {
  id: number;
  name: string;
  description: string | null;
  status: "draft" | "pending" | "approved" | "rejected" | "cancelled";
  startDate: string;
  endDate: string | null;
  projectId: number;
  projectName: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string;
}

const columns: ColumnDef<Estimate>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    header: ({ column }: { column: Column<Estimate, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const params = useParams();
      return (
        <Link href={`/${params.organization}/estimates/${row.original.id}`} className="hover:underline">
          {row.original.name}
        </Link>
      );
    },
    meta: {
      label: "Name",
      placeholder: "Search estimates...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "projectName",
    accessorFn: (row) => row.projectName,
    header: ({ column }: { column: Column<Estimate, unknown> }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Estimate["projectName"]>()}</div>,
    enableColumnFilter: false,
  },
  {
    id: "status",
    accessorFn: (row) => row.status,
    header: ({ column }: { column: Column<Estimate, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Estimate["status"]>()}</div>,
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    id: "startDate",
    accessorFn: (row) => row.startDate,
    header: ({ column }: { column: Column<Estimate, unknown> }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ cell }) => format(new Date(cell.getValue<Estimate["startDate"]>()), "MMM d, yyyy"),
  },
  {
    id: "endDate",
    accessorFn: (row) => row.endDate,
    header: ({ column }: { column: Column<Estimate, unknown> }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue<Estimate["endDate"]>();
      return value ? format(new Date(value), "MMM d, yyyy") : "-";
    },
  },
];

export default function EstimatesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  const estimates = useQuery({
    ...trpc.estimate.getAll.queryOptions(),
    placeholderData: [],
  });

  const projects = useQuery({
    ...trpc.project.getAll.queryOptions(),
    placeholderData: [],
  });

  const filteredData = useMemo(() => {
    if (!name) return estimates.data || [];
    const searchTerm = name.toLowerCase();
    return (estimates.data || []).filter(
      (estimate) =>
        estimate.name.toLowerCase().includes(searchTerm) ||
        (estimate.projectName?.toLowerCase().includes(searchTerm) ?? false),
    );
  }, [estimates.data, name]);

  const { table } = useDataTable<Estimate>({
    data: filteredData,
    columns,
    pageCount: Math.ceil((filteredData.length || 0) / 20),
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Estimates" text="You can find the list of estimates here">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Estimate
        </Button>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreateEstimateForm
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => estimates.refetch()}
        projects={projects.data || []}
      />
    </DashboardShell>
  );
}
