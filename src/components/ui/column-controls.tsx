import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";

export const ColumnControls = ({ children, setSortingType, sortingType, id }: any) => {
  const { key } = sortingType;

  return (
    <Button
      onClick={() => setSortingType({ key: key === 0 ? 1 : key > 0 ? -1 : 0, id: id })}
      className={`gap-x-1 border-none px-0 py-0 group ${sortingType > 0 ? "text-black" : "text-slate-500"}`}
    >
      {children}
      {key === 0 ? (
        <ChevronsUpDown className="h-4 w-4 invisible group-hover:visible" />
      ) : key > 0 ? (
        <ChevronUp className="h-4 w-4 invisible group-hover:visible" />
      ) : (
        <ChevronDown className="h-4 w-4 invisible group-hover:visible" />
      )}
    </Button>
  );
};
