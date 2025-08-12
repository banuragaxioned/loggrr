"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Circle, Minus, Pencil, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { checkAccess, getUserRole } from "@/lib/helper";

export interface Logged {
  id: number;
  name: string;
  image: string;
  hours: number;
  comments: string;
  billable: boolean;
  milestone?: {
    name: string;
  };
  task?: {
    name: string;
  };
  subRows?: {
    name: string;
    hours: number;
  }[];
}

export const columns: ColumnDef<Logged>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, getValue }) => {
      const { depth } = row;
      const canExpand = row.getCanExpand();
      const isExpanded = row.getIsExpanded();
      const value = getValue() as string;

      return (
        <div className="ml-8 flex items-center gap-2" style={{ marginLeft: `${depth * 32}px` }}>
          {depth !== 1 && canExpand && (
            <Button
              {...{
                onClick: row.getToggleExpandedHandler(),
              }}
              variant="outline"
              className="z-10 h-6 w-6 shrink-0 p-0"
            >
              {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
            </Button>
          )}
          <div
            className={`${depth === 0 ? "font-medium" : ""} ${canExpand || depth !== 1 ? "" : "descendent"} relative flex items-center gap-2`}
          >
            {depth === 0 && (
              <UserAvatar
                user={{ name: row.original.name ?? null, image: row.original.image ?? null }}
                className="h-6 w-6 bg-slate-300"
              />
            )}
            <span className={`${depth === 1 ? "w-[150px]" : "w-full"} line-clamp-1 shrink-0`}>{value}</span>
            {depth === 1 && (
              <span className="md:inline">
                <span className="ml-2 line-clamp-1 opacity-50" title={row.original.comments}>
                  {row.original?.comments ?? ""}
                </span>
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "hours",
    header: () => <span className="inline-block w-20 text-right">Hours</span>,
    cell: ({ row }) => {
      return <TimeEntryCell row={row} />;
    },
  },
];

function TimeEntryCell({ row }: { row: any }) {
  const { depth, original } = row;
  const params = useParams();
  const router = useRouter();
  const team = params.team as string;
  const formatted = `${row.getValue("hours") ?? 0} h`;

  const { data: session } = useSession();
  const user = session?.user;
  const workspaceRole = getUserRole(user?.workspaces, team);
  const hasFullAccess = checkAccess(workspaceRole, ["USER", "GUEST", "INACTIVE"]);
  console.log(hasFullAccess, "hasFullAccess");

  const deleteTimeEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/team/time-entry?team=${team}&id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Failed to delete. Server responded with ${response.status}`);

      toast("Time entry deleted!");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error deleting time entry", error);
    }
  };

  return (
    <>
      <span className={`group relative mr-4 inline-block w-20 text-right ${depth === 0 ? "font-semibold" : ""}`}>
        <span className={`${depth > 0 ? "opacity-50" : ""} mr-1`}>{formatted}</span>
        {original.billable && (
          <Circle className="absolute -right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 fill-success stroke-none sm:-right-3.5 md:-right-4" />
        )}
      </span>
      {depth > 0 && (
        <div className="absolute bottom-0 right-20 top-0 mr-4 hidden items-center justify-center gap-2 group-hover:flex">
          <Button variant="ghost" className="h-6 w-6 p-0">
            <Pencil size={12} />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-6 w-6 p-0 text-destructive">
                <Trash size={12} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Are you sure to delete this time entry?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your time entry.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="outline" size="sm" asChild>
                  <DialogClose>Cancel</DialogClose>
                </Button>
                <Button type="button" size="sm" onClick={() => deleteTimeEntry(original.id)} asChild>
                  <DialogClose>Delete</DialogClose>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
