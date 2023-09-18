"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Dispatch } from "react";
import { SkillUpdate } from "./data-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface SkillsList {
  id: number,
  name: string,
  edit?: string,
}

export function skillName(editSkillNames: () => void, isEditing: SkillUpdate, setIsEditing: Dispatch<SkillUpdate>) {

  const columns: ColumnDef<SkillsList>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            className="text-slate-500"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Skills
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          (isEditing?.id === row.original.id ? <Input defaultValue={row.original.name} onBlur={(e) => setIsEditing({ id: row.original.id, updatedValue: e.target.value })} className="w-auto h-auto" /> : row.original.name)
        )
      }
    },
    {
      id: "edit",
      cell: ({ row }: { row: any }) => {

        return (
          <div className={cn("invisible flex gap-x-3", "group-hover:visible")}>
            {
              isEditing?.id === row.original.id ?
                <Button
                  title="Save"
                  className={cn("h-auto border-0 bg-inherit p-0")}
                  onClick={() => {
                    editSkillNames()
                    setIsEditing({ id: 0, updatedValue: '' })
                  }}
                >
                  <Icons.save height={18} width={18} />
                </Button> :
                <Button
                  title="Edit"
                  className={cn("h-auto border-0 bg-inherit p-0")}
                  onClick={() =>
                    setIsEditing({ id: row.original.id, updatedValue: '' })
                  }
                >
                  <Icons.edit height={18} width={18} />
                </Button>
            }
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


