"use client";

import { Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Status } from "@prisma/client";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { UserAvatar } from "@/components/user-avatar";
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
import { Button } from "@/components/ui/button";

export type Users = {
  usersOnProject: {
    id: number;
    projectId: number;
    createdAt: Date;
  }[];
  id: number;
  name: string | null;
  image: string | null;
};

interface GetColumn {
  removeMember: (userId: number) => void;
}

export const getColumn = ({ removeMember }: GetColumn) => {
  const columns: ColumnDef<Users>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2">
            <UserAvatar
              user={{
                name: row.original.name ?? "",
                image: row.original.image ?? "",
              }}
              className="z-10 mr-2 inline-block h-6 w-6"
            />
            <span className="cursor-default">{row.original.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Added on" />,
      cell: ({ row }) => {
        const date = row.original.usersOnProject?.[0].createdAt;
        return <span>{date && format(new Date(date), "MMMM dd, yyyy")}</span>;
      },
      filterFn: "arrIncludesSome",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className={cn("invisible flex items-center gap-x-3 group-hover:visible")}>
            <Dialog>
              <DialogTrigger asChild>
                <button title="Delete">
                  <Trash size={16} className="cursor-pointer text-destructive" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Are you sure to delete this member?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the member from the project.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <DialogClose>Cancel</DialogClose>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => removeMember(row.original.usersOnProject?.[0].id)}
                    asChild
                  >
                    <DialogClose>Delete</DialogClose>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
