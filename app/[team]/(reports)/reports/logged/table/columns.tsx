"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
interface LoggedHours {
  id: number;
  date: string;
  description: string;
  hours: number;
}

interface Members {
  id: number;
  name: string;
  hours: number;
  loggedHours?: LoggedHours[];
}

export interface Task {
  id: number;
  name: string;
  hours: number;
  members?: Members[];
}

export interface Logged {
  id: number;
  name: string;
  hours: number;
  tasks?: Task[];
}

export const columns: ColumnDef<Logged>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "hours",
    header: () => <span className="inline-block w-20 text-right">Hours</span>,
    cell: ({ row }) => {
      const formatted = `${row.getValue("hours")} h`;

      return <span className="text-bold inline-block w-20 text-right">{formatted}</span>;
    },
  },
];
