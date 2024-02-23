"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Attendance } from "@/types";



export const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <span className="block w-full text-left first-letter:capitalize">{row.original.name}</span>
      )
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return (
        <span className="block w-full text-left first-letter:capitalize">{row.original.email}</span>
      )
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => {
      return (
        <span className="block w-full text-left first-letter:capitalize">{row.original.location}</span>
      )
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sign in Time" />,
    cell: ({ row }) => {
      return (
        <span className="block w-full text-left first-letter:capitalize">{row?.original?.startTime?.toLocaleString()}</span>
      )
    },
    filterFn: "arrIncludesSome",
  },
];
