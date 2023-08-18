"use client";

import { Members } from "@/types";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

export const columns: ColumnDef<Members>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <UserAvatar
            user={{
              name: row.original.name ? row.original.name : "",
              image: row.original.image ? row.original.image : "",
            }}
            className="z-10 mr-2 inline-block h-5 w-5"
          />
          <span>{row.original.name}</span>
        </div>
      );
    },
    meta: {
      className: "w-[30%]",
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    meta: {
      className: "w-[40%]",
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    filterFn: "arrIncludesSome",
    meta: {
      className: "w-[15%]",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    filterFn: "arrIncludesSome",
    meta: {
      className: "w-[15%]",
    },
  },
];
