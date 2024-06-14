"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Status } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { getTimeInHours } from "@/lib/helper";
import { Info } from "lucide-react";
import { CustomTooltip } from "@/components/custom/tooltip";

export type Projects = {
  id: number;
  name: string | null | undefined;
  status: Status;
  clientName: string;
  budget: number | null;
  logged: number;
  owner: string | null;
  ownerImage: string | null;
};

export const columns: ColumnDef<Projects>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "owner",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Project Owner" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <UserAvatar
          user={{
            name: row.original.owner ? row.original.owner : "",
            image: row.original.ownerImage ? row.original.ownerImage : "",
          }}
          className="z-10 mr-2 inline-block h-6 w-6"
        />
        <span className="cursor-default">{row.original.owner}</span>
      </div>
    ),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "logged",
    meta: {
      className: "w-[10%]",
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Logged"
        child={
          <CustomTooltip trigger={<Info className="ml-1.5" size={14} />} content="Over last 30 days" sideOffset={10} />
        }
      />
    ),
    cell: ({ row }) => (
      <span className="block w-full pr-[35%] text-right tabular-nums">{`${Math.round(getTimeInHours(row.original.logged))} h`}</span>
    ),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "status",
    meta: {
      className: "w-[10%]",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    filterFn: "arrIncludesSome",
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return (
  //       <div
  //         className={cn("invisible flex items-center gap-x-3 group-hover:visible")}
  //         onClick={(e) => e.stopPropagation()}
  //       >
  //         <Popover>
  //           <PopoverTrigger asChild>
  //             <Button
  //               size={"sm"}
  //               className="h-0 border-none bg-transparent p-3 text-primary hover:text-primary-foreground"
  //               title="More"
  //             >
  //               <MoreVertical height={16} width={16} />
  //             </Button>
  //           </PopoverTrigger>
  //           <PopoverContent className="w-auto overflow-hidden p-0 text-sm">
  //             <div className="hover:bg-hover flex cursor-pointer items-center border-b border-border p-2 text-primary">
  //               <Edit height={16} width={16} className="mr-2" />
  //               Edit
  //             </div>
  //             <div className="hover:bg-hover flex cursor-pointer items-center border-b border-border p-2 text-destructive">
  //               <Delete height={16} width={16} className="mr-2" />
  //               Delete
  //             </div>
  //             <div className="hover:bg-hover flex cursor-pointer items-center p-2">
  //               <Archive height={16} width={16} className="mr-2" />
  //               Archive
  //             </div>
  //           </PopoverContent>
  //         </Popover>
  //       </div>
  //     );
  //   },
  //   meta: {
  //     className: "w-[10%]",
  //   },
  // },
];
