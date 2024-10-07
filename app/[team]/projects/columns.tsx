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
  clientId: number;
  budget?: number;
  logged?: number;
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
          className="z-10 mr-2 inline-block h-6 w-6 bg-slate-300"
        />
        <span className="cursor-default">{row.original.owner}</span>
      </div>
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
