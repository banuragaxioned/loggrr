"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Status } from "@prisma/client";

export type Client = {
  id: number;
  name: string;
  status: Status;
  Project: number;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "Project",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active Projects" />,
    cell: ({ row }) => <span className="block w-full pl-[15%] tabular-nums">{row.original.Project}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    filterFn: "arrIncludesSome",
  },
];
