"use client";

import { Members } from "@/types";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { debounce } from "@/lib/utils";
import { UserGroup } from "@/types";
import { InlineSelect } from "@/components/inline-select";
import RoleDropdown from "./role-dropdown";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface GetColumn {
  updateStatus: (id: number, role: string, name?: string) => void;
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
      cell: ({ row }) => {
        const { role, id, name } = row.original;

        return <RoleDropdown userRole={role} id={id} name={name} updateStatus={updateStatus} />;
      },
      meta: {
        className: "w-[15%]",
      },
    },
  ];
  return columns;
};
