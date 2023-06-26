"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Assignment } from "@/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const getDynamicColumns = ()=> {
  return  {
    accessorKey: "totalTime",
    header: ({ }) => {
      return (
        <Button variant="link" className="text-slate-500">
          23 June
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }
}

export const columns: ColumnDef<Assignment>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="link" className="text-slate-500">
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
 getDynamicColumns()
];
