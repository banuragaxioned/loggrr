"use client";

import { Members } from "@/types";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils"

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

export const getColumn = (updateStatus: (id: number) => void) => {
  const columns: ColumnDef<Members>[] = [
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
        className: "w-[30%]",
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
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className={cn("flex gap-3 invisible", row.original.role !== "INACTIVE" && "group-hover:visible")}>
            <Button
              title="Inactive"
              className={cn("border-0 bg-inherit p-2")}
              onClick={() => row.original.role === "INACTIVE" ? null : updateStatus(row.original.id)}
            >
              <Icons.minusCircle height={18} width={18} />
            </Button>
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
