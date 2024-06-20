"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { UserGroup } from "@/types";

export const columns: ColumnDef<UserGroup>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Group" />,
    cell: ({ row }) => <span className="flex h-auto py-1 text-sm">{row.original.name}</span>,
  },
];
