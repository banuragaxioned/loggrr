"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Circle, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

export interface Logged {
  id: number;
  name: string;
  image: string;
  hours: number;
  comments: string;
  billable: boolean;
  milestone?: {
    name: string;
  };
  task?: {
    name: string;
  };
  subRows?: {
    name: string;
    hours: number;
  }[];
}

export const columns: ColumnDef<Logged>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, getValue }) => {
      const { depth } = row;
      const canExpand = row.getCanExpand();
      const isExpanded = row.getIsExpanded();
      const value = getValue() as string;
      const userImage = depth === 0 && row.original.image;

      return (
        <div className="ml-8 flex items-center gap-2" style={{ marginLeft: `${depth * 32}px` }}>
          {depth !== 1 && canExpand && (
            <Button
              {...{
                onClick: row.getToggleExpandedHandler(),
              }}
              variant="outline"
              className="z-10 h-6 w-6 shrink-0 p-0"
            >
              {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
            </Button>
          )}
          <div
            className={`${depth === 0 ? "font-medium" : ""} ${canExpand || depth !== 1 ? "" : "descendent opacity-75"} relative flex items-center gap-2`}
          >
            {depth === 0 && (
              <UserAvatar
                user={{ name: row.original.name ?? null, image: row.original.image ?? null }}
                className="h-8 w-8 bg-slate-300"
              />
            )}
            <span className={`${depth === 1 ? "w-[150px]" : "w-full"} line-clamp-1 shrink-0`}>{value}</span>
            {depth === 1 && (
              <span className="md:inline">
                <span className="ml-2 line-clamp-1 opacity-50" title={row.original.comments}>
                  {row.original?.comments ?? ""}
                </span>
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "hours",
    header: () => <span className="inline-block w-20 text-right">Hours</span>,
    cell: ({ row }) => {
      const { depth, original } = row;
      const formatted = `${row.getValue("hours") ?? 0} h`;

      return (
        <span className={`relative mr-4 inline-block w-20 text-right ${depth === 0 ? "font-semibold" : ""}`}>
          <span className={`${depth > 0 ? "opacity-75" : ""} mr-1 `}>{formatted}</span>
          {original.billable && (
            <Circle className="absolute -right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 fill-success stroke-none sm:-right-3.5 md:-right-4" />
          )}
        </span>
      );
    },
  },
];
