"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Logged = {
  id: number;
  hours: number;
  name: string;
};

export const columns: ColumnDef<Logged>[] = [
  {
    accessorKey: "name",
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
    accessorKey: "hours",
    header: ({ column }) => {
      return (
        <Button variant="link" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Hours
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
