"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Circle, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface Logged {
  id: number;
  name: string;
  image: string;
  hours: number;
  comments: string;
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
      const { depth, original } = row;
      const canExpand = row.getCanExpand();
      const isExpanded = row.getIsExpanded();
      const value = getValue() as string;
      const userImage = depth === 0 && row.original.image;

      console.log(row.original);

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
            className={`${depth === 0 ? "font-medium" : ""} ${canExpand || depth !== 1 ? "" : "descendent opacity-50"} relative flex items-center gap-2`}
          >
            {userImage && (
              <Image src={userImage} alt="User Image" width={24} height={24} className="rounded-full object-center" />
            )}
            <span className="line-clamp-1 w-full shrink-0">{value}</span>
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
          <span className={`${depth > 0 ? "opacity-50" : ""} mr-1 sm:mr-0`}>{formatted}</span>
          {/* {original.billable && (
            <Circle className="absolute -right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 fill-success stroke-none sm:-right-3.5 md:-right-4" />
          )} */}
        </span>
      );
    },
  },
];
