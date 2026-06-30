"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Building2, ChevronRight, Edit, FolderKanban, Save, X } from "lucide-react";
import { Status } from "@/generated/prisma/browser";
import { Dispatch, RefObject } from "react";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function ClientStatusBadge({ status }: { status: Status }) {
  const isPublished = status === "PUBLISHED";

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2 text-xs font-medium capitalize",
        isPublished
          ? "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
          : "border-border bg-muted/80 text-muted-foreground",
      )}
    >
      {isPublished ? "Published" : "Archived"}
    </Badge>
  );
}

function ProjectCountBadge({ count }: { count: number }) {
  const hasProjects = count > 0;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2 text-xs font-medium tabular-nums",
        hasProjects
          ? "border-sky-200/80 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300"
          : "border-border bg-muted/50 text-muted-foreground",
      )}
    >
      <FolderKanban className="mr-1 h-3 w-3 shrink-0" />
      {hasProjects ? `${count} active` : "None"}
    </Badge>
  );
}

export function clientName(
  editClientNames: (id: number, name: string) => void,
  isEditing: number,
  setIsEditing: Dispatch<number>,
  refInput: RefObject<HTMLInputElement | null>,
) {
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      meta: {
        className: "min-w-[200px] max-w-[360px]",
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        if (isEditing === row.original.id) {
          return (
            <Input
              defaultValue={row.original.name}
              ref={refInput}
              className="bg-background h-8 max-w-xs shadow-xs"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsEditing(0);
                }
                if (e.key === "Enter") {
                  editClientNames(isEditing, refInput.current?.value ?? row.original.name);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          );
        }

        return (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="group-hover:text-primary truncate font-medium transition-colors">{row.original.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "project",
      meta: {
        className: "w-[140px]",
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Active Projects" />,
      cell: ({ row }) => <ProjectCountBadge count={row.original.project} />,
    },
    {
      accessorKey: "status",
      meta: {
        className: "w-[120px]",
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <ClientStatusBadge status={row.original.status} />,
      filterFn: "arrIncludesSome",
    },
    {
      id: "edit",
      meta: {
        className: "w-20",
      },
      cell: ({ row }) => {
        const isRowEditing = isEditing === row.original.id;

        return (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
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
                      editClientNames(isEditing, value);
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
              <Button
                title="Edit"
                variant="ghost"
                size="icon"
                className="text-muted-foreground invisible h-7 w-7 group-hover:visible"
                onClick={() => setIsEditing(row.original.id)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
            {row.original.project > 0 && !isRowEditing && (
              <ChevronRight className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </div>
        );
      },
    },
  ];

  return columns;
}
