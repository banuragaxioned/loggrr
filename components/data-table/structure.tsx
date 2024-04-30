"use client";

import * as React from "react";
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, Row } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table/pagination";
import { cn } from "@/lib/utils";
import { TableProps } from "@/types";

interface DataTableProps<TData, TValue> {
  tableConfig: TableProps<TData, TValue>;
  DataTableToolbar?: React.ComponentType<any>;
  toolBarProps?: {};
  className?: string;
}

export function DataTableStructure<TData, TValue>({
  tableConfig,
  DataTableToolbar,
  toolBarProps,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...tableConfig,
  });

  return (
    <>
      {DataTableToolbar && <DataTableToolbar table={table} {...toolBarProps} />}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className={cn(header.column.columnDef.meta?.className)}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={className}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id} className={cn(cell.column.columnDef.meta?.className)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </>
  );
}
