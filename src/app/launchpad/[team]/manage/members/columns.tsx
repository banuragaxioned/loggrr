"use client";

import { Members } from "@/types";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}



export const getColumn = (team: string) => {
  const showToast = useToast();
  const router = useRouter()

  const updateStatus = async (id: number, team: string) => {
    const response = await fetch("/api/team/members/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team,
        userId: id,
      }),
    });
  
    if (response?.ok) showToast("Status Updated", "success");
  
    router.refresh()
  }

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
        className: "w-[30%]",
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      meta: {
        className: "w-[30%]",
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
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      filterFn: "arrIncludesSome",
      meta: {
        className: "w-[15%]",
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className={cn("flex gap-3 invisible", row.original.status !== "DEACTIVATED" && "group-hover:visible")}>
            <Button
              title="Deactivate"
              className={cn("border-0 bg-inherit p-2")}
              onClick={() => row.original.status === "DEACTIVATED" ? null : updateStatus(row.original.id, team)}
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
