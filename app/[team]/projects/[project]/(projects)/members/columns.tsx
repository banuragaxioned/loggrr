"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Status } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Archive, Delete, Edit, MoreVertical } from "lucide-react";

export type Users = {
  id: number;
  name: string | null;
  status: Status;
  image: string | null;
  email: string;
};

interface GetColumn {
  removeMember: (userId: number) => void;
}

export const getColumn = ({ removeMember  }: GetColumn) => {
  const columns: ColumnDef<Users>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
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
      ),
      filterFn: "arrIncludesSome",
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      filterFn: "arrIncludesSome",
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      filterFn: "arrIncludesSome",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div
            className={cn("invisible flex items-center gap-x-3 group-hover:visible")}
            onClick={(e) => e.stopPropagation()}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size={"sm"}
                  className="h-0 border-none bg-transparent p-3 text-primary hover:text-primary-foreground"
                  title="More"
                >
                  <MoreVertical height={16} width={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0 text-sm">
                <div className="disabled hover:bg-hover flex items-center border-b border-border p-2 text-primary">
                  <Edit height={16} width={16} className="mr-2" />
                  Edit
                </div>
                <div className="hover:bg-hover flex cursor-pointer items-center border-b border-border p-2 text-destructive"
                  onClick={() => (removeMember(row.original.id))}>
                  <Delete height={16} width={16} className="mr-2" />
                  Remove
                </div>
              </PopoverContent>
            </Popover>
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