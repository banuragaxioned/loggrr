"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Status } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons";

export type Projects = {
  id: number;
  name: string | null | undefined;
  status: Status;
  clientName: string;
  budget: number;
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
          className="z-10 mr-2 inline-block h-5 w-5"
        />
        <span className="cursor-default">{row.original.owner}</span>
      </div>
    ),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "budget",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Budget" />,
    cell: ({ row }) => <span className="block w-full pr-[50%] text-right tabular-nums">{row.original.budget}</span>,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "logged",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Logged " />,
    cell: ({ row }) => <span className="block w-full pr-[50%] text-right tabular-nums">{row.original.logged}</span>,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    filterFn: "arrIncludesSome",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className={cn("invisible flex gap-x-3", "group-hover:visible relative z-10")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-transparent border-none px-[10px] py-[12px] h-0 w-[40px]" title="More">
              <Icons.more height={18} width={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-8 p-0">
              <div className="border-b-[1px] border-b-gray-50 w-auto">
                <Icons.edit height={18} width={18} />
                Edit
              </div>
            </PopoverContent>
          </Popover>
          {/* <Button
            title="Remove"
            className={cn("h-auto border-0 bg-inherit p-0")}
            onClick={() => console.log('here')}
          >
            <Icons.minusCircle height={18} width={18} />
          </Button> */}
        </div>
      );
    },
    meta: {
      className: "w-[10%]",
    },
  },
];
