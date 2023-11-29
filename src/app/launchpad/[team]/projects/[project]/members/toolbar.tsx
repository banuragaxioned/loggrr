"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { roles } from "@/config/filters";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";
import { Camera } from "lucide-react";
import { DataTableToolbarProps } from "@/types";

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-10 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}
