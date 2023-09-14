"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, ArrowUpDown } from "lucide-react";
import { Summary } from "@/types";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface SkillsList {
  id: number,
  name: string,
  edit?: string,
}

export function skillName(editSkillNames: (id: number, name: string) => void) {
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
          <Input value={row.original.name} disabled className="w-auto h-auto" />
        )
      }
    },
    // {
    //   accessorKey: "budget",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="link"
    //         className="text-slate-500"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Budget
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "logged",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="link"
    //         className="text-slate-500"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Logged
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "projectOwner",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="link"
    //         className="text-slate-500"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Project Leads
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    // },
    // {
    //   id: "actions",
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex gap-3">
    //         <Button className="border-0 bg-inherit p-0">
    //           <Archive height={18} width={18} />
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
    {
      id: "edit",
      cell: ({ row }: { row: any }) => {
        console.log(row);

        return (
          <div className={cn("invisible flex gap-x-3", "group-hover:visible")}>
            <Button
              title="Edit"
              className={cn("h-auto border-0 bg-inherit p-0")}
              onClick={() =>
                row?.original?.name ? null : editSkillNames(row?.original?.id, row.original.name)
              }
            >
              <Icons.edit height={18} width={18} />
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


