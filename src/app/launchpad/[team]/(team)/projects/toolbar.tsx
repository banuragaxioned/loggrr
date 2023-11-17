"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientStatuses } from "@/config/filters";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { ListRestart } from "lucide-react";
import { DataTableToolbarProps } from "@/types";
import { removeDuplicatesFromArray } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function DataTableToolbar<TData extends { clientName: string }>({ table }: DataTableToolbarProps<TData>) {
  const client = useSearchParams().get("client");

  const isFiltered = table.getState().columnFilters.length > 0;

  const uniqueClientList = removeDuplicatesFromArray(table.options.data.map((client: { clientName: string }) => client.clientName) as []);
  const clientList = uniqueClientList.map((name: string) => ({
    label: name,
    value: name,
  }));
  useEffect(() => {
    client && table.getColumn("clientName")?.setFilterValue(Array(client));
  }, []);
  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={clientStatuses} />}
        {table.getColumn("clientName") && <DataTableFacetedFilter column={table.getColumn("clientName")} title="Client" options={clientList} />}
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
