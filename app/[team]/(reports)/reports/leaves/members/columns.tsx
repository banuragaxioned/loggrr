"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export type LeaveRecord = {
  id: number;
  user: {
    id: number;
    name: string | null;
    email: string;
    image: string | null;
  };
  leaves: {
    planned: {
      eligible: number;
      taken: number;
    };
    unplanned: {
      eligible: number;
      taken: number;
    };
    compoff: {
      eligible: number;
      taken: number;
    };
  };
};

const EditButton = ({ id }: { id: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Button
      size="icon"
      variant="outline"
      className="flex items-center justify-center"
      onClick={() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("edit_id", id.toString());
        router.replace(`?${params.toString()}`);
      }}
    >
      <Edit size={16} />
    </Button>
  );
};

export const getColumn = () => {
  const columns: ColumnDef<LeaveRecord>[] = [
    {
      accessorKey: "user",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Member" />,
      filterFn: (row, id, value) => {
        const user = row.getValue(id) as { name: string | null };
        return user.name?.toLowerCase().includes((value as string).toLowerCase()) ?? false;
      },
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-x-2">
            <UserAvatar
              user={{
                name: user.name ? user.name : "",
                image: user.image ? user.image : "",
              }}
              className="z-10 mr-2 inline-block h-6 w-6 bg-slate-300"
            />
            <span>{user.name}</span>
          </div>
        );
      },
      meta: {
        className: "w-[30%]",
      },
    },
    {
      accessorKey: "leaves.planned",
      enableSorting: false,
      header: () => <div className="text-left">Planned Leave</div>,
      cell: ({ row }) => {
        const leaves = row.original.leaves;
        return (
          <div className="flex flex-col gap-1">
            <div className="text-sm">
              <span className="font-medium">Eligible:</span> {leaves.planned.eligible}
            </div>
            <div className="text-sm">
              <span className="font-medium">Taken:</span> {leaves.planned.taken}
            </div>
            <div className="text-sm">
              <span className="font-medium">Remaining:</span> {leaves.planned.eligible - leaves.planned.taken}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "leaves.unplanned",
      enableSorting: false,
      header: () => <div className="text-left">Unplanned Leave</div>,
      cell: ({ row }) => {
        const leaves = row.original.leaves;
        return (
          <div className="flex flex-col gap-1">
            <div className="text-sm">
              <span className="font-medium">Eligible:</span> {leaves.unplanned.eligible}
            </div>
            <div className="text-sm">
              <span className="font-medium">Taken:</span> {leaves.unplanned.taken}
            </div>
            <div className="text-sm">
              <span className="font-medium">Remaining:</span> {leaves.unplanned.eligible - leaves.unplanned.taken}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "leaves.compoff",
      enableSorting: false,
      header: () => <div className="text-left">Comp-off</div>,
      cell: ({ row }) => {
        const leaves = row.original.leaves;
        return (
          <div className="flex flex-col gap-1">
            <div className="text-sm">
              <span className="font-medium">Eligible:</span> {leaves.compoff.eligible}
            </div>
            <div className="text-sm">
              <span className="font-medium">Taken:</span> {leaves.compoff.taken}
            </div>
            <div className="text-sm">
              <span className="font-medium">Remaining:</span> {leaves.compoff.eligible - leaves.compoff.taken}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const record = row.original;

        return (
          <div className="flex items-center justify-end">
            <EditButton id={record.id} />
          </div>
        );
      },
      meta: {
        className: "w-[20px]",
      },
    },
  ];
  return columns;
};
