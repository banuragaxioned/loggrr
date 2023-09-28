"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Dispatch } from "react";
import { SkillUpdate } from "./data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface SkillsList {
  id: number;
  name: string;
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
          <span className="flex rounded-md border border-transparent bg-primary px-3 text-sm text-primary-foreground placeholder:opacity-75 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 h-auto w-auto py-1 border-c">
            {row.original.name}
          </span>
        );
      },
    },
    {
      id: "edit",
      cell: ({ row }) => {
        return (
          <div className={cn("invisible flex gap-x-3", "group-hover:visible")}>
            {isEditing === row.original.id ? (
              <Button
                title="Save"
                className={cn("h-auto border-0 bg-inherit p-0")}
                onClick={() => {
                  setIsEditing(row.original.id)
                  editSkillNames(isEditing, refButton?.current?.value);
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
      id: "edit",
      cell: ({ row }) => {
        return (
          <div className={cn("invisible flex gap-x-3", "group-hover:visible")}>
          
              <Button
                title="Save"
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
