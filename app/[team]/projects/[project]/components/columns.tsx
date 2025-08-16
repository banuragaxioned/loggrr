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
import { hoursToDecimal } from "@/lib/helper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";

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
  const project = params.project as string;
  const [comments, setComments] = useState(original.comments);
  const [time, setTime] = useState(String(original.hours));
  const [billable, setBillable] = useState(original.billable);
  const formatted = `${row.getValue("hours") ?? 0} h`;

  const submitTimeEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const timeToStoreInDB = +hoursToDecimal(time ?? "0") * 60;

    // Add validation for time
    if (timeToStoreInDB <= 0) {
      toast.error("Time cannot be 0 or negative");
      return;
    }

    // Add validation for comments
    if (comments?.trim() === "") {
      toast.error("Comments cannot be empty");
      return;
    }

    const dataToSend = {
      team,
      project: +project,
      milestone: original.milestone?.id || null,
      time: timeToStoreInDB,
      comments: comments?.trim(),
      billable: billable,
      task: original.task?.id || null,
    };

    try {
      const response = await fetch("/api/team/time-entry", {
        method: "PUT",
        body: JSON.stringify({ ...dataToSend, id: original.id }),
      });

      if (response.ok) {
        toast.success(`Time entry updated for ${original.name}`);
        router.refresh();
      }

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting form!", error);
    }
  };

  const deleteTimeEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/team/time-entry?team=${team}&id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(`Time entry deleted!`);
        router.refresh();
      }

      if (!response.ok) {
        const data = await response.json();
        console.log(data, "data");
        toast.error(data.error);
      }
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-6 w-6 p-0">
                <Pencil size={12} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit time entry</DialogTitle>
                <DialogDescription>{original.name}</DialogDescription>
              </DialogHeader>
              <form onSubmit={submitTimeEntry} className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4">
                  <div className="flex w-full flex-col gap-2">
                    <Label>Comments</Label>
                    <Input
                      placeholder="Enter comment"
                      type="text"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Time</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="2.30"
                      className="w-[60px]"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Billable</Label>
                  <Switch
                    className="data-[state=checked]:bg-success"
                    checked={billable}
                    onCheckedChange={setBillable}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <DialogClose>Cancel</DialogClose>
                  </Button>
                  <Button type="submit" size="sm" asChild>
                    <DialogClose>Save</DialogClose>
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
