"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientStatuses } from "@/config/filters";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { Icons } from "@/components/icons";
import { DataTableToolbarProps } from "@/types";
import { useClientStore } from "@/store/clientStore";
import { useEffect } from "react";
import { useCurrentUserStore } from "@/store/currentuserstore";

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [clients, fetchClients] = useClientStore(state => [state.clients, state.fetch])
  const team = useCurrentUserStore(state => state.team)
  
  useEffect(() => {
    if (clients.length < 0) fetchClients(team)
  }, [team])
  
  const clientList = clients?.map(client => ({
    label: client.name,
    value: client.name
  }))

  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={clientStatuses} />
        )}
        {table.getColumn("clientName") && clientList && (
          <DataTableFacetedFilter column={table.getColumn("clientName")} title="Client" options={clientList} />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Icons.reset className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
