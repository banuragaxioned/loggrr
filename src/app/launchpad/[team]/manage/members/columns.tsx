"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header2";
import { Members } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";

export const columns: ColumnDef<Members>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
       <div className="flex items-center gap-x-2">
        <UserAvatar
          user={{ name:row.original.name ? row.original.name : "", image: row.original.image ? row.original.image :"" }}
          className="z-10 mr-2 inline-block h-5 w-5"
        />
        <span>{row.original.name}</span>
       </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  },
];
