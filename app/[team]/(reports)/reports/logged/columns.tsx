"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getRandomColor } from "@/lib/random-colors";

export interface Logged {
  id: number;
  name: string;
  hours?: number;
  description?: string;
  image?: string;
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
      const userImage = depth === 2 && row.original.image;

      return (
        <div className={`flex items-center gap-2 ml-${depth * 8}`}>
          {depth !== 0 && depth !== 3 && canExpand && (
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
          <div
            className={`${depth === 0 ? "font-medium" : ""} ${canExpand || depth !== 3 ? "" : "descendent"} relative flex items-center gap-2`}
          >
            {depth === 0 && (
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: getRandomColor(row.original.id) }}
              >
                {value.charAt(0)}
              </span>
            )}
            {userImage && (
              <Image src={userImage} alt="User Image" width={24} height={24} className="rounded-full object-center" />
            )}
            <span className="w-[200px]">{value}</span>
            {depth === 3 && <span className="ml-12 opacity-50">{original?.description ?? ""}</span>}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "hours",
    header: () => <span className="inline-block w-20 text-right">Hours</span>,
    cell: ({ row }) => {
      const { depth } = row;
      const formatted = `${row.getValue("hours") ?? 0} h`;

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
