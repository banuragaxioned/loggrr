"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Status } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Archive, Delete, Edit, MoreVertical } from "lucide-react";

export type Projects = {
  id: number;
  name: string | null | undefined;
  status: Status;
  clientName: string;
  budget: number;
  logged: number;
  owner: string | null;
  ownerImage: string | null;
};

export const columns: ColumnDef<Projects>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "owner",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Project Owner" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <UserAvatar
          user={{
            name: row.original.owner ? row.original.owner : "",
            image: row.original.ownerImage ? row.original.ownerImage : "",
          }}
          className="z-10 mr-2 inline-block h-5 w-5"
        />
        <span className="cursor-default">{row.original.owner}</span>
      </div>
    ),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "budget",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Budget" />,
    cell: ({ row }) => <span className="block w-full pr-[50%] text-center tabular-nums">{row.original.budget}</span>,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "logged",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Logged" />,
    cell: ({ row }) => <span className="block w-full pr-[50%] text-center tabular-nums">{row.original.logged}</span>,
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
        <div className={cn("invisible flex gap-x-3 group-hover:visible")} onClick={(e) => e.stopPropagation()}>
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
              <div className="hover:bg-hover flex cursor-pointer items-center border-b border-border p-2 text-primary">
                <Edit height={16} width={16} className="mr-2" />
                Edit
              </div>
              <div className="hover:bg-hover flex cursor-pointer items-center border-b border-border p-2 text-destructive">
                <Delete height={16} width={16} className="mr-2" />
                Delete
              </div>
              <div className="hover:bg-hover flex cursor-pointer items-center p-2">
                <Archive height={16} width={16} className="mr-2" />
                Archive
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
