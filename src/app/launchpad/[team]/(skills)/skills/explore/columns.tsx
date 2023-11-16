"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Dispatch } from "react";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface SkillsList {
  id: number;
  name: string;
  users: number;
  edit?: string;
}

export function skillName(editSkillNames: (id: number, name: string) => void, isEditing: number, setIsEditing: Dispatch<number>, refButton: any, deleteSkillNames: (id: number) => void) {

  const columns: ColumnDef<SkillsList>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Skills" />,
      cell: ({ row }) => {
        return isEditing === row.original.id ? (
          <Input
            defaultValue={row.original.name}
            ref={refButton}
            className="h-auto w-auto py-1"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsEditing(0);
              }
              if (e.key === 'Enter') {
                editSkillNames(isEditing, refButton?.current?.value);
              }
            }}
          />
        ) : (
          <span className="flex rounded-md border border-transparent text-sm h-auto w-auto py-1">
            {row.original.name}
          </span>
        );
      },
      meta: {
        className: "w-[45%]"
      }
    },
    {
      accessorKey: "users",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Users" />,
      cell: ({ row }) => <span className="block w-full pl-4 tabular-nums">{row.original.users}</span>,
    },
    {
      id: "edit",
      cell: ({ row }) => {
        return (
          <div className={cn("invisible flex gap-x-3 items-center justify-center", "group-hover:visible")}>
            {isEditing === row.original.id ? (
              <Button
                title="Save"
                className={cn("h-auto border-0 bg-inherit p-0")}
                onClick={() => {
                  setIsEditing(row.original.id)
                  if(row.original.name !== refButton?.current?.value) {
                    editSkillNames(isEditing, refButton?.current?.value);
                  } else {
                    setIsEditing(0)
                  }
                }}
              >
                <Icons.save height={18} width={18} />
              </Button>
            ) : (
              <Button
                title="Edit"
                className={cn("h-auto border-0 bg-inherit p-0")}
                onClick={() => setIsEditing(row.original.id)}
              >
                <Icons.edit height={18} width={18} />
              </Button>
            )}
          </div>
        );
      },
      meta: {
        className: "w-[10%]",
      },
    },
    {
      id: "delete",
      cell: ({ row }) => {
        return (
          <div className={cn("invisible flex gap-x-3 items-center justify-center", "group-hover:visible")}>
              <Button
                title="Delete"
                className={cn("h-auto border-0 bg-inherit p-0")}
                onClick={() => {
                  deleteSkillNames(row.original.id);
                }}
              >
                <Icons.delete height={18} width={18} />
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
}