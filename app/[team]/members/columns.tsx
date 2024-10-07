"use client";

import { Members } from "@/types";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import { cn, debounce } from "@/lib/utils";
import { UserGroup } from "@/types";
import { InlineSelect } from "@/components/inline-select";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface GetColumn {
  updateStatus: (id: number) => void;
  userGroup: UserGroup[];
  updateUserGroup: (options: { id: number }[], id: number) => void;
}

export const getColumn = ({ updateStatus, userGroup, updateUserGroup }: GetColumn) => {
  const userGroupList = userGroup.map((option) => ({
    id: option.id,
    name: option.name,
  }));

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
              className="z-10 mr-2 inline-block h-6 w-6 bg-slate-300"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Groups" />,
      cell: ({ row }) => {
        const selectedGroups = row.original.userGroup;
        return (
          <InlineSelect
            onSelect={(selectedOption) => debounce(() => updateUserGroup(selectedOption, row.original.id), 200)()}
            options={userGroupList}
            selectedValues={selectedGroups}
            title="group"
            label="Add in a group"
          />
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
              variant={"ghost"}
              className={cn("h-auto border-0 bg-inherit p-0 text-primary")}
              onClick={() => (row.original.role === "INACTIVE" ? null : updateStatus(row.original.id))}
            >
              <MinusCircle height={16} width={16} />
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
