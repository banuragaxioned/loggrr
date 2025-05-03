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
import { CreateEstimateItemForm } from "../create-estimate-item-form";

interface EstimateItem {
  id: number;
  skillId: number;
  skillName: string | null;
  duration: number;
  rate: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

const columns: ColumnDef<EstimateItem>[] = [
  {
    id: "skillName",
    accessorKey: "skillName",
    header: ({ column }: { column: Column<EstimateItem, unknown> }) => (
      <DataTableColumnHeader column={column} title="Skill" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<EstimateItem["skillName"]>()}</div>,
    meta: {
      label: "Skill",
      placeholder: "Search skills...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "duration",
    accessorKey: "duration",
    header: ({ column }: { column: Column<EstimateItem, unknown> }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<EstimateItem["duration"]>()} minutes</div>,
    meta: {
      label: "Duration",
      placeholder: "Search duration...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "rate",
    accessorKey: "rate",
    header: ({ column }: { column: Column<EstimateItem, unknown> }) => (
      <DataTableColumnHeader column={column} title="Rate" />
    ),
    cell: ({ cell }) => {
      const item = cell.row.original;
      return (
        <div>
          {item.currency} {cell.getValue<EstimateItem["rate"]>()}/hour
        </div>
      );
    },
    meta: {
      label: "Rate",
      placeholder: "Search rate...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "total",
    accessorKey: "total",
    header: ({ column }: { column: Column<EstimateItem, unknown> }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ cell }) => {
      const item = cell.row.original;
      const total = (Number(item.rate) * item.duration) / 60; // Convert minutes to hours
      return (
        <div>
          {item.currency} {total.toFixed(2)}
        </div>
      );
    },
    meta: {
      label: "Total",
      placeholder: "Search total...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
];

interface EstimateItemsClientProps {
  id: string;
}

export function EstimateItemsClient({ id }: EstimateItemsClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  const estimateItems = useQuery({
    ...trpc.estimate.getItems.queryOptions({ estimateId: Number(id) }),
    placeholderData: [],
  });

  const filteredData = useMemo(() => {
    if (!name) return estimateItems.data || [];
    const searchTerm = name.toLowerCase();
    return (estimateItems.data || []).filter(
      (item) =>
        item.skillName?.toLowerCase().includes(searchTerm) ||
        item.rate.toLowerCase().includes(searchTerm) ||
        item.currency.toLowerCase().includes(searchTerm),
    );
  }, [estimateItems.data, name]);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil((filteredData.length || 0) / 20),
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Estimate Items" text="You can find the list of estimate items here">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreateEstimateItemForm
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => estimateItems.refetch()}
        estimateId={Number(id)}
      />
    </DashboardShell>
  );
}
