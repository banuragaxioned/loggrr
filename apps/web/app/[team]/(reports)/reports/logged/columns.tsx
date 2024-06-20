"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Circle, Minus, Plus } from "lucide-react";
import { getRandomColor } from "@/lib/random-colors";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

export interface Logged {
  id: number;
  name: string;
  hours?: number;
  description?: string;
  image?: string;
  billable?: boolean;
  subRows?: {
    id: number;
    name: string;
    hours?: number;
  }[];
}

export const columns: ColumnDef<Logged>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, getValue }) => {
      const { depth, original } = row;
      const canExpand = row.getCanExpand();
      const isExpanded = row.getIsExpanded();
      const value = getValue() as string;

      return (
        <div className="ml-8 flex items-center gap-2" style={{ marginLeft: `${depth * 32}px` }}>
          {depth !== 0 && depth !== 3 && canExpand && (
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
          {depth === 1 && !canExpand && (
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-white"
              style={{ backgroundColor: getRandomColor(row.original.id) }}
            >
              {value.charAt(0)}
            </span>
          )}
          <div
            className={`${depth === 0 ? "font-medium" : ""} ${canExpand || depth !== 3 ? "" : "descendent"} relative flex items-center gap-2`}
          >
            {depth === 0 && (
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-white"
                style={{ backgroundColor: getRandomColor(row.original.id) }}
              >
                {value.charAt(0)}
              </span>
            )}
            {depth === 2 && (
              <UserAvatar
                user={{ name: row.original.name ?? null, image: row.original.image ?? null }}
                className="h-6 w-6 bg-slate-300"
              />
            )}
            <span className={`${depth === 3 ? "w-full md:w-[200px]" : "w-full"} line-clamp-1 shrink-0`}>{value}</span>
            {depth === 3 && (
              <span className="hidden md:inline">
                <span className="ml-2 line-clamp-1 opacity-50" title={original.description}>
                  {original?.description ?? ""}
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
        <span className={`text-bold relative inline-block w-20 text-right ${depth === 0 ? "font-semibold" : ""}`}>
          <span className={`${depth > 1 ? "opacity-50" : ""} mr-1 sm:mr-0`}>{formatted}</span>
          {original.billable && (
            <Circle className="absolute -right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 fill-success stroke-none sm:-right-3.5 md:-right-4" />
          )}
        </span>
      );
    },
  },
];
