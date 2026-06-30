"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Save, Trash, X } from "lucide-react";
import { Dispatch, RefObject } from "react";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import type { GroupRow } from "./data-table";

function MemberCountBadge({ count }: { count: number }) {
  const hasMembers = count > 0;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md px-2 text-xs font-medium tabular-nums",
        hasMembers
          ? "border-indigo-200/80 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-200"
          : "border-border bg-muted/50 text-muted-foreground",
      )}
    >
      {hasMembers ? `${count} member${count === 1 ? "" : "s"}` : "Empty"}
    </Badge>
  );
}

interface GetColumnsProps {
  isEditing: number;
  setIsEditing: Dispatch<number>;
  refInput: RefObject<HTMLInputElement | null>;
  editGroupName: (id: number, name: string) => void;
  deleteGroup: (id: number, memberCount: number) => void;
  canManage: boolean;
}

export function getColumns({
  isEditing,
  setIsEditing,
  refInput,
  editGroupName,
  deleteGroup,
  canManage,
}: GetColumnsProps) {
  const columns: ColumnDef<GroupRow>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Group" />,
      cell: ({ row }) => {
        if (isEditing === row.original.id) {
          return (
            <Input
              defaultValue={row.original.name}
              ref={refInput}
              className="bg-background h-8 max-w-xs shadow-xs"
              autoFocus
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsEditing(0);
                }
                if (e.key === "Enter") {
                  editGroupName(row.original.id, refInput.current?.value ?? row.original.name);
                }
              }}
            />
          );
        }

        return <span className="group-hover:text-primary truncate font-medium transition-colors">{row.original.name}</span>;
      },
      meta: {
        className: "min-w-[220px]",
      },
    },
    {
      accessorKey: "memberCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Members" />,
      cell: ({ row }) => <MemberCountBadge count={row.original.memberCount} />,
      meta: {
        className: "w-[140px]",
      },
    },
  ];

  if (canManage) {
    columns.push({
      id: "actions",
      meta: {
        className: "w-24",
      },
      cell: ({ row }) => {
        const isRowEditing = isEditing === row.original.id;

        return (
          <div className="flex items-center justify-end gap-1" onClick={(event) => event.stopPropagation()}>
            {isRowEditing ? (
              <>
                <Button
                  title="Save"
                  variant="ghost"
                  size="icon"
                  className="text-primary h-7 w-7"
                  onClick={() => {
                    const value = refInput.current?.value ?? row.original.name;
                    if (row.original.name !== value) {
                      editGroupName(row.original.id, value);
                    } else {
                      setIsEditing(0);
                    }
                  }}
                >
                  <Save className="h-3.5 w-3.5" />
                </Button>
                <Button
                  title="Cancel"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-7 w-7"
                  onClick={() => setIsEditing(0)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  title="Edit"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground invisible h-7 w-7 group-hover:visible"
                  onClick={() => setIsEditing(row.original.id)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      title="Delete"
                      variant="ghost"
                      size="icon"
                      className="text-destructive invisible h-7 w-7 group-hover:visible"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete {row.original.name}?</DialogTitle>
                      <DialogDescription>
                        {row.original.memberCount > 0
                          ? `This group has ${row.original.memberCount} member${row.original.memberCount === 1 ? "" : "s"}. They will be removed from the group but not from the workspace.`
                          : "This action cannot be undone. This will permanently delete the group."}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="button" variant="outline" size="sm" asChild>
                        <DialogClose>Cancel</DialogClose>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGroup(row.original.id, row.original.memberCount)}
                        asChild
                      >
                        <DialogClose>Delete</DialogClose>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        );
      },
    });
  }

  return columns;
}
