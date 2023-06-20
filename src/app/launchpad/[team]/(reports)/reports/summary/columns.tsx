"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, ArrowUpDown } from "lucide-react";
import { Summary } from "@/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Summary>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="text-slate-500"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="text-slate-500"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Budget
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "logged",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="text-slate-500"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Logged
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "projectOwner",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="text-slate-500"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Leads
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
          <div className="flex gap-3">
            <Button className="border-0 bg-inherit p-0">
              <Archive height={18} width={18} />
            </Button>
          </div>
      );
    },
  },
];
