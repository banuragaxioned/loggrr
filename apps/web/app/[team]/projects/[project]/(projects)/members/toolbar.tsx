"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ListRestart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableToolbarProps } from "@/types";

export function DataTableToolbar<TData extends { clientName: string }>({ table }: DataTableToolbarProps<TData>) {
  const client = useSearchParams().get("client");

  const isFiltered = table.getState().columnFilters.length > 0;

  useEffect(() => {
    client && table.getColumn("clientName")?.setFilterValue(Array(client));
  }, []);

  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border border-dashed p-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by member name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
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
