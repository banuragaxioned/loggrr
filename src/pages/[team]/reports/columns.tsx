"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Logged = {
  id: string
  hours: number
  name: string
}

export const columns: ColumnDef<Logged>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "hours",
    header: "Hours",
  },
]
