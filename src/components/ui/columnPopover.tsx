import React,{useEffect, useState} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ChevronsUpDown, EyeOff,Eye, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";

export const ColumnPopover = ({ children, setSortingType, sortingType, id,index }: any) => {
  const indexArr = sortingType.indexArr ? sortingType.indexArr : [] ;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center outline-none">
        {children}
        <ChevronsUpDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="[&>div>button]:border-none">
        <DropdownMenuItem className="flex">
          <Button
            onClick={() => setSortingType({key:1,id:id,index:[...indexArr,index]})}
            title="Ascending"
            className={sortingType > 0 ? "text-black" : "text-slate-500"}
          >
            <ArrowUpNarrowWide className="h-4 w-4" />
            Asc
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex">
          <Button
            onClick={() => setSortingType({key:-1,id:id,index:[...indexArr,index]})}
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
              <Button onClick={() => indexArr?.find((num:number)=>num === index) ? setSortingType({key:0,indexArr:indexArr?.filter((num:number)=>num!==index)}) : setSortingType({key:0,id:id,indexArr:[...indexArr,index]})} title="Hide" className="text-slate-500">
                {
                 indexArr?.find((num:number)=>num === index) ?
                  <>
                  <Eye className="h-4 w-4" />
                  Show
                  </>
                  :
                  <>
                  <EyeOff className="h-4 w-4" />
                  Hide
                  </>
                }
              </Button>
            </DropdownMenuLabel>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
