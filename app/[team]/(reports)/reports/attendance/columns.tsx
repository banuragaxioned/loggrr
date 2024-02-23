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
        <span className="block w-full text-left">{row.original.email}</span>
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
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      return (
        <span className="block w-full text-left first-letter:capitalize">{row?.original?.startTime && new Date(row.original.startTime).toLocaleDateString()}</span>
      )
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sign In" />,
    cell: ({ row }) => {
      console.log(row.original);
      
      return (
        <span className="block w-full text-left first-letter:capitalize">{row?.original?.startTime && new Date(row.original.startTime).toLocaleTimeString()}</span>
      )
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sign Out" />,
    cell: ({ row }) => {
      return (
        <span className="block w-full text-left first-letter:capitalize">{row?.original?.endTime && new Date(row.original.endTime).toLocaleTimeString()}</span>
      )
    },
    filterFn: "arrIncludesSome",
  },
];
