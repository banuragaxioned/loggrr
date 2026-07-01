"use client";

import * as React from "react";
import { flexRender, getPaginationRowModel, Row, useReactTable } from "@tanstack/react-table";
import { Users } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table/pagination";
import { cn } from "@/lib/utils";

export interface GroupRow {
  id: number;
  name: string;
  memberCount: number;
  createdAt: Date;
}

interface GroupsDataTableProps {
  tableConfig: Parameters<typeof useReactTable<GroupRow>>[0];
  DataTableToolbar: React.ComponentType<{ table: ReturnType<typeof useReactTable<GroupRow>> }>;
  rowClickHandler?: (row: Row<GroupRow>) => void;
}

export function GroupsDataTable({ tableConfig, DataTableToolbar, rowClickHandler }: GroupsDataTableProps) {
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

      <div className="bg-card overflow-hidden rounded-xl border shadow-xs">
        <Table containerClassName="rounded-none border-0" className="border-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/30 hover:bg-muted/30 border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-muted-foreground h-10 text-xs font-medium tracking-wide uppercase",
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "group border-border/60 border-b transition-colors",
                    rowClickHandler && "hover:bg-muted/40 cursor-pointer",
                  )}
                  onClick={() => rowClickHandler?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn("py-3.5", cell.column.columnDef.meta?.className)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getAllColumns().length} className="h-40">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="bg-muted rounded-full p-3">
                      <Users className="text-muted-foreground h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">No groups found</p>
                    <p className="text-muted-foreground text-xs">
                      Create a group to organize members on the Members page.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Showing <span className="text-foreground font-medium tabular-nums">{visibleCount}</span> group
          {visibleCount === 1 ? "" : "s"}
        </p>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
