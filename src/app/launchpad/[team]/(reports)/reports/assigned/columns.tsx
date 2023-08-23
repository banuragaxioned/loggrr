"use client";

import { ColumnDef, RowData } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Icons } from "@/components/icons";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      console.log(row.getCanExpand())
      return (
        <div className="flex items-center gap-x-2">
          {row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              className: 'cursor-pointer' ,
            }}
          >
            {row.getIsExpanded() ? <Icons.chevronDown className="h-4 w-4" /> : <Icons.chevronRight className="h-4 w-4" />}
          </button>)
          :null
          }
          <UserAvatar
            user={{
              name: row.original.name ? row.original.name : "",
              image: row.original.image ? row.original.image : "",
            }}
            className="z-10 mr-2 inline-block h-5 w-5"
          />
          <span>{row.original.name}</span>
        </div>
      );
    },
    meta: {
      className: "w-[30%]",
    },
  },

];
