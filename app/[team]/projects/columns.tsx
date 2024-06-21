"use client";

import { Info } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Status } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { getTimeInHours } from "@/lib/helper";
import { CustomTooltip } from "@/components/custom/tooltip";

import { cn } from "@/lib/utils";
import StatusDropdown from "./status-dropdown";

export type Projects = {
  id: number;
  name: string | null | undefined;
  status: Status;
  clientName: string;
  budget: number | null;
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
          className="z-10 mr-2 inline-block h-6 w-6"
        />
        <span className="cursor-default">{row.original.owner}</span>
      </div>
    ),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "logged",
    meta: {
      className: "w-[10%]",
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Logged"
        child={
          <CustomTooltip trigger={<Info className="ml-1.5" size={14} />} content="Over last 30 days" sideOffset={10} />
        }
      />
    ),
    cell: ({ row }) => (
      <span className="block w-full pr-[35%] text-right tabular-nums">{`${Math.round(getTimeInHours(row.original.logged))} h`}</span>
    ),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "status",
    meta: {
      className: "w-[10%]",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    filterFn: "arrIncludesSome",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, status } = row.original;
      return (
        <div className={cn("flex items-center gap-x-3")} onClick={(e) => e.stopPropagation()}>
          <StatusDropdown id={id} status={status} />
        </div>
      );
    },
    meta: {
      className: "w-[20px]",
    },
  },
];
