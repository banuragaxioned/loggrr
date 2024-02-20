"use client";

import { Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Status } from "@prisma/client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";

export type Users = {
  id: number;
  name: string | null;
  image: string | null;
  createdAt: Date;
};

interface GetColumn {
  removeMember: (userId: number) => void;
}

export const getColumn = ({ removeMember }: GetColumn) => {
  const columns: ColumnDef<Users>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2">
            <UserAvatar
              user={{
                name: row.original.name ?? "",
                image: row.original.image ?? "",
              }}
              className="z-10 mr-2 inline-block h-5 w-5"
            />
            <span className="cursor-default">{row.original.name}</span>
          </div>
        );
      },
      filterFn: "arrIncludesSome",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Added on" />,
      cell: ({ row }) => {
        return <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>;
      },
      filterFn: "arrIncludesSome",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className={cn("invisible flex items-center gap-x-3 group-hover:visible")}>
            <Trash size={16} onClick={() => removeMember(row.original.id)} className="cursor-pointer text-red-500" />
          </div>
        );
      },
      meta: {
        className: "w-[10%]",
      },
    },
  ];

  return columns;
};
