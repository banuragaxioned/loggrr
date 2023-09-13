"use client";

import { Members } from "@/types";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { UserGroup } from "@/types";
import { MultipleSelect } from "@/components/multiple-select";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface GetColumn {
  updateStatus: (id: number) => void,
  userGroup: UserGroup[]
}

export const getColumn = ({updateStatus, userGroup}: GetColumn)  => {

  const userGroupList = userGroup.map(option => ({
    id: option.id,
    value: option.name,
    label: option.name
  }))

  const columns: ColumnDef<Members>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2">
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
        className: "w-[25%]",
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      meta: {
        className: "w-[25%]",
      },
    },
    {
      accessorKey: "userGroup",
      header: ({ column }) => <DataTableColumnHeader column={column} title="User Group" />,
      cell: ({ row }) => {
        const selectedGroups = row.original.userGroup.map(option => ({
          id: option.id,
          label: option.name,
          value: option.name
        }));
        return (
          <MultipleSelect options={userGroupList} selectedValues={selectedGroups} title="Search Group"/>
        );
      },
      meta: {
        className: "w-[25%]",
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      filterFn: "arrIncludesSome",
      meta: {
        className: "w-[15%]",
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className={cn("invisible flex gap-x-3", row.original.role !== "INACTIVE" && "group-hover:visible")}>
            <Button
              title="Inactive"
              className={cn("h-auto border-0 bg-inherit p-0")}
              onClick={() => (row.original.role === "INACTIVE" ? null : updateStatus(row.original.id))}
            >
              <Icons.minusCircle height={18} width={18} />
            </Button>
          </div>
        );
      },
      meta: {
        className: "w-[10%]",
      },
    },
  ];
  return columns;
};
