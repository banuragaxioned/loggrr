"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListRestart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { roles } from "@/config/filters";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";
import { DataTableToolbarProps } from "@/types";

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const group = searchParams.get("group");

  const isFiltered = table.getState().columnFilters.length > 0 || status || group;

  const handleShowInactive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    router.push(
      pathname +
        "?" +
        new URLSearchParams({
          ...(isChecked && { status: "all" }),
          ...(group && { group }),
        }),
    );
  };

  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border border-dashed p-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by member name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="w-40 lg:w-64"
        />
        {table.getColumn("role") && (
          <DataTableFacetedFilter column={table.getColumn("role")} title="Role" options={roles} />
        )}
        <div className="flex items-center space-x-2 select-none">
          <input
            type="checkbox"
            id="inactive"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-4 w-4 cursor-pointer rounded-md border p-0 text-sm accent-current file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            onChange={handleShowInactive}
            checked={status === "all"}
          />
          <label htmlFor="inactive" className="cursor-pointer text-sm leading-none font-medium">
            Show inactive members
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
