"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserAvatar } from "@/components/user-avatar";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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

const DeleteButton = ({ id }: { id: number }) => {
  const searchParams = useParams();
  const router = useRouter();
  const { team } = searchParams;

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/team/leaves`, {
        method: "DELETE",
        body: JSON.stringify({ id, team }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to delete leave record");
      }

      toast.success(`Leave record deleted successfully for ${data.user.name}`);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="text-destructive">
          <Trash size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure to delete this leave record?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the leave record.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" size="sm" asChild>
            <DialogClose>Cancel</DialogClose>
          </Button>
          <Button type="button" size="sm" onClick={handleDelete} asChild>
            <DialogClose>Delete</DialogClose>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const LeaveCell = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="inline-block w-20 text-xs font-medium uppercase tracking-wider text-black/70">{title}</span>
      <span
        className={cn(
          "inline-block w-10 text-right",
          value < 0 && title === "Remaining" && "text-red-500",
          title === "Remaining" && value > 0 && "text-green-500",
        )}
      >
        {value}
      </span>
    </div>
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
              className="z-10 mr-2 inline-block h-8 w-8 bg-slate-300"
            />
            <span className="min-w-[150px]">{user.name}</span>
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
            <LeaveCell title="Eligible" value={leaves.planned.eligible} />
            <LeaveCell title="Taken" value={leaves.planned.taken} />
            <LeaveCell title="Remaining" value={leaves.planned.eligible - leaves.planned.taken} />
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
            <LeaveCell title="Eligible" value={leaves.unplanned.eligible} />
            <LeaveCell title="Taken" value={leaves.unplanned.taken} />
            <LeaveCell title="Remaining" value={leaves.unplanned.eligible - leaves.unplanned.taken} />
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
            <LeaveCell title="Eligible" value={leaves.compoff.eligible} />
            <LeaveCell title="Taken" value={leaves.compoff.taken} />
            <LeaveCell title="Remaining" value={leaves.compoff.eligible - leaves.compoff.taken} />
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const record = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <EditButton id={record.id} />
            <DeleteButton id={record.id} />
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
