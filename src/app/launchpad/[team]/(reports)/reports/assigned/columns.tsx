"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Assignment = {
  id: number;
  date: Date;
  endate?: Date | null;
  billableTime?: number;
  nonBillableTime?: number;
  projectId: number;
  projectName: string;
  userId: number;
  userName?: string | null;
  userImage?: string | null;
  frequency: string;
  status: string;
};

export const columns: ColumnDef<Assignment>[] = [
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
    accessorKey: "frequency",
    header: ({ column }) => {
      return (
        <Button variant="link" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Frequency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "billableTime",
    header: ({ column }) => {
      return (
        <Button variant="link" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Billable
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "nonBillableTime",
    header: ({ column }) => {
      return (
        <Button variant="link" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Non-billable
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];