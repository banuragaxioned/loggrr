"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Status } from "@prisma/client";
import Link from "next/link";

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
    cell: ({ row }) => (
      <Link
        href={{ pathname: "projects", search: `client=${row.original.name}` }}
        title="Projects"
        className="tabular-nums"
      >
        {row.original.Project}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    filterFn: "arrIncludesSome",
  },
];
