"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, ArrowUpDown, TrashIcon } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Summary = {
  id: number;
  date: Date;
  projectId: number;
  projectName: string;
  time: number,
  userId: number;
  userName?: string | null;
  userImage?: string | null;
  status: string;
};

export const columns: ColumnDef<Summary>[] = [
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button variant="link" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <Button variant="link" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <Button variant="link" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const assignment = row.original;
      return (
        <div className="flex gap-3">
          <Button className="border-0 bg-inherit p-0">
            <TrashIcon height={18} width={18} />
          </Button>
          <Button className="border-0 bg-inherit p-0">
            <Archive height={18} width={18} />
          </Button>
        </div>
      );
    },
  },
];
