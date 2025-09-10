"use client";

import { ColumnDef } from "@tanstack/react-table";
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
      variant="ghost"
      className="w-full justify-start"
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

export const columns: ColumnDef<LeaveRecord>[] = [
  {
    accessorKey: "user",
    enableSorting: true,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Member" />,
    cell: ({ row }) => {
      const user = row.getValue("user") as { name: string | null; email: string; image: string | null };
      return (
        <div className="flex items-center gap-2">
          <UserAvatar
            user={{
              name: user.name || user.email,
              image: user.image,
            }}
          />
          <span>{user.name || user.email}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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

      return <EditButton id={record.id} />;
    },
  },
];
