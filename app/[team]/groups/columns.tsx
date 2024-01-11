"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "components/data-table/column-header";
import { UserGroup } from "types";

export const columns: ColumnDef<UserGroup>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Group" />,
  },
];
