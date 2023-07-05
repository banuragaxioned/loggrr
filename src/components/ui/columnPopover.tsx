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

export const ColumnPopover = ({ children, setSortingType, sortingType, id }: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex outline-none">
        {children}
        <ChevronsUpDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="[&>div>button]:border-none">
        <DropdownMenuItem className="flex">
          <Button
            onClick={() => setSortingType({key:1,id:id})}
            title="Ascending"
            className={sortingType > 0 ? "text-black" : "text-slate-500"}
          >
            <ArrowUpNarrowWide className="h-4 w-4" />
            Asc
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex">
          <Button
            onClick={() => setSortingType({key:-1,id:id})}
            title="Descending"
            className={sortingType < 0 ? "text-black" : "text-slate-500"}
          >
            <ArrowDownWideNarrow className="h-4 w-4" />
            Desc
          </Button>
        </DropdownMenuItem>
        {id !== "name" && (
          <>
            <DropdownMenuSeparator className="mx-auto w-[80%] border-t-[1px] border-slate-500" />
            <DropdownMenuLabel className="flex text-slate-500">
              <Button onClick={() => setSortingType({key:0,id:id})} title="Hide" className="text-slate-500">
                <EyeOff className="h-4 w-4" />
                Hide
              </Button>
            </DropdownMenuLabel>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
