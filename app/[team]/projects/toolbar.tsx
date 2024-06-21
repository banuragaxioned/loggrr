"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, ListRestart } from "lucide-react";
import { DataTableToolbarProps } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import MultiSelectFilter from "../(reports)/reports/logged/multiselect-filters";
import { useEffect, useState } from "react";

export function DataTableToolbar<TData extends { clientName: string; clientId: number }>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
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

  const isFiltered = table.getState().columnFilters.length > 0 || status;

  useEffect(() => {
    const allClients = table.options.data.map((item) => ({ name: item.clientName, id: item.clientId }));
    const filteredClients = allClients.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
    setUniqueClients(filteredClients);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`?${new URLSearchParams({
              status: status === "all" ? "" : "all",
              clients: clients ?? "",
            })}`}
          >
            Show {status === "all" ? "Published" : "All"}
          </Link>
        </Button>
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
