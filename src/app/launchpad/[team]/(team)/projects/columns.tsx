"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Status } from "@prisma/client";

export type Projects = {
  id: number;
  name: string | null | undefined;
  status: Status;
  clientName: string
};

export const columns: ColumnDef<Projects>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
    filterFn: "arrIncludesSome",
  }
];
