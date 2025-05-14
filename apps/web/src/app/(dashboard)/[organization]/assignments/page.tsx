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
import { CreateAssignmentForm } from "./create-assignment-form";
import { formatMinutesToHours } from "@/lib/duration";

interface Assignment {
  id: number;
  projectId: number;
  projectName: string;
  memberId: string;
  memberName: string;
  estimateItemId: number;
  positionId: number;
  positionName: string;
  duration: number;
}

const columns: ColumnDef<Assignment>[] = [
  {
    id: "projectName",
    accessorKey: "projectName",
    header: ({ column }: { column: Column<Assignment, unknown> }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Assignment["projectName"]>()}</div>,
    meta: {
      label: "Project",
      placeholder: "Search projects...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "memberName",
    accessorKey: "memberName",
    header: ({ column }: { column: Column<Assignment, unknown> }) => (
      <DataTableColumnHeader column={column} title="Member" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Assignment["memberName"]>()}</div>,
    meta: {
      label: "Member",
      placeholder: "Search members...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "positionName",
    accessorKey: "positionName",
    header: ({ column }: { column: Column<Assignment, unknown> }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Assignment["positionName"]>()}</div>,
    meta: {
      label: "Position",
      placeholder: "Search positions...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "duration",
    accessorKey: "duration",
    header: ({ column }: { column: Column<Assignment, unknown> }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ cell }) => <div>{formatMinutesToHours(cell.getValue<Assignment["duration"]>())}h</div>,
  },
];

export default function AssignmentsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  const assignments = useQuery({
    ...trpc.assignment.getAll.queryOptions(),
    placeholderData: [],
  });

  console.log(assignments.data);

  const filteredData = useMemo(() => {
    if (!name) return assignments.data || [];
    const searchTerm = name.toLowerCase();
    return (assignments.data || []).filter(
      (assignment) =>
        assignment.projectName.toLowerCase().includes(searchTerm) ||
        assignment.memberName.toLowerCase().includes(searchTerm) ||
        assignment.positionName.toLowerCase().includes(searchTerm),
    );
  }, [assignments.data, name]);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil((filteredData.length || 0) / 20),
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Assignments" text="You can find the list of assignments here">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreateAssignmentForm open={isOpen} onOpenChange={setIsOpen} onSuccess={() => assignments.refetch()} />
    </DashboardShell>
  );
}
