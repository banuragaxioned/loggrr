"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListRestart } from "lucide-react";
import { DataTableToolbarProps } from "@/types";

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  console.log(table.getState().columnFilters);

  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border border-dashed p-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by member name"
          value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("user")?.setFilterValue(event.target.value)}
          className="w-40 lg:w-64"
        />
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <ListRestart className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
