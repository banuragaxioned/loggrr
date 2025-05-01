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
import { InviteMemberForm } from "./invite-member-form";

interface Member {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

const columns: ColumnDef<Member>[] = [
  {
    id: "name",
    accessorFn: (row) => row.user.name,
    header: ({ column }: { column: Column<Member, unknown> }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div>{row.original.user.name ?? "Unnamed User"}</div>,
    meta: {
      label: "Name",
      placeholder: "Search by name...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "email",
    accessorFn: (row) => row.user.email,
    header: ({ column }: { column: Column<Member, unknown> }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.original.user.email ?? "No email"}</div>,
  },
  {
    id: "role",
    accessorKey: "role",
    header: ({ column }: { column: Column<Member, unknown> }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
    meta: {
      label: "Role",
      variant: "select",
      options: [
        { label: "Owner", value: "owner" },
        { label: "Admin", value: "admin" },
        { label: "Member", value: "member" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<Member, unknown> }) => (
      <DataTableColumnHeader column={column} title="Joined At" />
    ),
    cell: ({ cell }) => format(new Date(cell.getValue<string>()), "MMM d, yyyy"),
  },
];

export default function MembersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  const members = useQuery({
    ...trpc.member.getAll.queryOptions(),
    placeholderData: [],
  });

  const filteredData = useMemo(() => {
    if (!name) return members.data || [];
    const searchTerm = name.toLowerCase();
    return (members.data || []).filter((member) => {
      const memberName = member.user.name?.toLowerCase() ?? "";
      const memberEmail = member.user.email?.toLowerCase() ?? "";
      return memberName.includes(searchTerm) || memberEmail.includes(searchTerm);
    });
  }, [members.data, name]);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil((filteredData.length || 0) / 20),
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text="You can find the list of members here">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <InviteMemberForm open={isOpen} onOpenChange={setIsOpen} onSuccess={() => members.refetch()} />
    </DashboardShell>
  );
}
