import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronsUpDown, EyeOff, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";

export const ColumnPopover = ({ children }: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex outline-none">
        {children}
        <ChevronsUpDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="cursor-pointer text-slate-500">
        <DropdownMenuItem className="flex">
          <ArrowUpNarrowWide className="h-4 w-4" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem className="flex">
          <ArrowDownWideNarrow className="h-4 w-4" />
          Desc
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-t-[1px] border-slate-500 w-[80%] mx-auto"/>
        <DropdownMenuLabel className="flex text-slate-500">
          <EyeOff className="h-4 w-4" />
          Hide
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
