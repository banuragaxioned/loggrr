import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ChevronsUpDown, EyeOff, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";

const clickHandler = ()=> {
  
}

export const ColumnPopover = ({ children,setSortingType }: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex outline-none">
        {children}
        <ChevronsUpDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="[&>div>button]:border-none [&>div>button]:text-slate-500" >
        <DropdownMenuItem className="flex">
          <Button onClick={(e)=>console.log("asec")}>
          <ArrowUpNarrowWide className="h-4 w-4" />
          Asc
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex">
        <Button onClick={(e)=>console.log("desc")}>
          <ArrowDownWideNarrow className="h-4 w-4" />
          Desc
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-t-[1px] border-slate-500 w-[80%] mx-auto"/>
        <DropdownMenuLabel className="flex text-slate-500">
        <Button onClick={(e)=>console.log("hide")}>
          <EyeOff className="h-4 w-4" />
          Hide
          </Button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
