"use client";

import * as React from "react";
import { flexRender, getPaginationRowModel, Row, useReactTable } from "@tanstack/react-table";
import { Building2 } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table/pagination";
import { cn } from "@/lib/utils";
import { Client } from "@/types";

interface ClientsDataTableProps {
  tableConfig: Parameters<typeof useReactTable<Client>>[0];
  DataTableToolbar: React.ComponentType<{ table: ReturnType<typeof useReactTable<Client>> }>;
  rowClickHandler?: (row: Row<Client>) => void;
}

export function ClientsDataTable({ tableConfig, DataTableToolbar, rowClickHandler }: ClientsDataTableProps) {
  const table = useReactTable({
    ...tableConfig,
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      ...tableConfig.initialState,
      pagination: {
        pageSize: 20,
        ...tableConfig.initialState?.pagination,
      },
    },
  });

  const visibleCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <Table containerClassName="rounded-none border-0" className="border-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-muted/30 hover:bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase",
                      header.column.columnDef.meta?.className,
                    )}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isArchived = row.original.status === "ARCHIVED";
                const hasProjects = row.original.project > 0;

                return (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "group border-b border-border/60 transition-colors",
                      hasProjects && "cursor-pointer hover:bg-muted/40",
                      hasProjects && "hover:border-l-primary border-l-2 border-l-transparent",
                      !hasProjects && "cursor-default",
                      isArchived && "opacity-70 hover:opacity-100",
                    )}
                    onClick={() => rowClickHandler?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn("py-3.5", cell.column.columnDef.meta?.className)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getAllColumns().length} className="h-40">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="bg-muted rounded-full p-3">
                      <Building2 className="text-muted-foreground h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">No clients found</p>
                    <p className="text-muted-foreground text-xs">Try adjusting your search or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Showing <span className="text-foreground font-medium tabular-nums">{visibleCount}</span> client
          {visibleCount === 1 ? "" : "s"}
        </p>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
