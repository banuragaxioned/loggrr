"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Client } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dispatch } from "react";
import { Edit } from "lucide-react";

// export function clientName(editClientNames: (id: number, name: string) => void, isEditing: number, setIsEditing: Dispatch<number>) {

  export const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: "Project",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Active Projects" />,
      cell: ({ row }) => <span className="block w-full pl-[15%] tabular-nums">{row.original.Project}</span>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      filterFn: "arrIncludesSome",
    },
    {
      id: "edit",
      cell: ({ row }) => {
        return (
          <div className={cn("invisible flex gap-x-3 items-center justify-center", "group-hover:visible")} onClick={(e) => e.stopPropagation()} >
            {/* {isEditing === row.original.id ? ( */}
              {/* <Button
                title="Save"
                className={cn("h-auto border-0 bg-inherit p-0")}
                // onClick={() => {
                //   setIsEditing(row.original.id)
                //   if(row.original.name !== refButton?.current?.value) {
                //     editSkillNames(isEditing, refButton?.current?.value);
                //   } else {
                //     setIsEditing(0)
                //   }
                // }}
              >
                <Icons.save height={18} width={18} />
              </Button>
            ) : ( */}
              <Button
                title="Edit"
                className={cn("h-auto border-0 bg-inherit p-0")}
                // onClick={() => setIsEditing(row.original.id)}
              >
                <Edit height={18} width={18} />
              </Button>
            {/* )} */}
          </div>
        );
      },
      meta: {
        className: "w-[10%]",
      },
    },
  ];
// }

