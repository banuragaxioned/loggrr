"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
interface LoggedHours {
  id: number;
  name: string;
  description: string;
  hours: number;
}

interface Members {
  id: number;
  name: string;
  hours: number;
  subRows?: LoggedHours[];
}

export interface Task {
  id: number;
  name: string;
  hours: number;
  subRows?: Members[];
}

export interface Logged {
  id: number;
  name: string;
  hours: number;
  subRows?: Task[];
  description?: string;
}

export const columns: ColumnDef<Logged>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, getValue }) => {
      const { depth, original } = row;
      const canExpand = row.getCanExpand();
      const isExpanded = row.getIsExpanded();
      const value = getValue();

      return (
        <div className={`flex items-center gap-2 ml-${depth * 8}`}>
          {depth !== 0 && canExpand && depth !== 3 && (
            <Button
              {...{
                onClick: row.getToggleExpandedHandler(),
              }}
              variant="outline"
              className="z-10 h-6 w-6 p-0"
            >
              {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
            </Button>
          )}
          <span
            className={`${depth === 0 ? "font-medium" : ""} ${canExpand || depth !== 3 ? "" : "descendent"} relative flex items-center gap-2`}
          >
            {/* TODO: To be replaced with project Logo */}
            {depth === 0 && <span className="flex h-6 w-6 rounded-full bg-slate-400" />}
            <>{value}</>
            {depth === 3 && <span className="ml-12 opacity-50">{original?.description ?? ""}</span>}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "hours",
    header: () => <span className="inline-block w-20 text-right">Hours</span>,
    cell: ({ row }) => {
      const { depth } = row;
      const formatted = `${row.getValue("hours")} h`;

      return (
        <span
          className={`text-bold inline-block w-20 text-right ${depth === 0 ? "font-semibold" : ""}  ${depth > 1 ? "opacity-50" : ""}`}
        >
          {formatted}
        </span>
      );
    },
  },
];
