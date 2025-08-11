"use client";

import { useEffect, useState } from "react";
import { Briefcase, ListRestart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableToolbarProps } from "@/types";
import MultiSelectFilter from "./multiselect-filters";

export function DataTableToolbar<TData extends { clientName: string; clientId: number }>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clients = searchParams.get("clients");
  const status = searchParams.get("status");

  const [uniqueClients, setUniqueClients] = useState<{ name: string; id: number }[]>([]);

  const clientFilter = {
    title: "Clients",
    searchable: true,
    icon: <Briefcase size={16} />,
    options: uniqueClients,
  };

  const isFiltered = table.getState().columnFilters.length > 0 || status || clients;

  useEffect(() => {
    const allClients = table.options.data.map((item) => ({ name: item.clientName, id: item.clientId }));
    const filteredClients = allClients.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
    setUniqueClients(filteredClients);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleShowArchived = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    router.push(
      pathname +
        "?" +
        new URLSearchParams({
          ...(isChecked && { status: "all" }),
          ...(clients && { clients }),
        }),
    );
  };

  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border border-dashed p-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by project name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="w-40 lg:w-64"
        />
        <MultiSelectFilter values={clientFilter} />
        <div className="flex select-none items-center space-x-2">
          <input
            type="checkbox"
            id="archived"
            className="flex h-4 w-4 cursor-pointer rounded-md border border-input bg-background p-0 text-sm accent-current ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={handleShowArchived}
            checked={status === "all"}
          />
          <label htmlFor="archived" className="cursor-pointer text-sm font-medium leading-none">
            Show archived
          </label>
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              router.push("?");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <ListRestart className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
