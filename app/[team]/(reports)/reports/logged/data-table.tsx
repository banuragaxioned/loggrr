"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  ExpandedState,
  getExpandedRowModel,
  Row,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTableToolbar } from "./toolbar";
import { Assignment } from "@/types";

export interface ClientAndUserInterface {
  id: number;
  name: string | null;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  allClients: ClientAndUserInterface[];
  allUsers: ClientAndUserInterface[];
  hasFullAccess?: boolean;
}

const expandingRowFilter = (row: Row<Assignment>, filterValue: string) => {
  const regex = new RegExp(filterValue, "ig");
  return regex.test(row.original.name);
};

export function DataTable<TData, TValue>({
  columns,
  data,
  allClients,
  allUsers,
  hasFullAccess,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnVisibility, setColumnVisibility] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFromLeafRows: true,
    filterFns: { expandingRowFilter },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onExpandedChange: setExpanded,
    getSubRows: (row: any) => row.subRows,
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      columnFilters,
      expanded,
      columnVisibility,
    },
  });

  useEffect(() => {
    router.refresh();
  }, [searchParams, router]);

  const handlePrintClick = () => {
    setIsPrintMode(true);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrintMode(false);
    };
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  useEffect(() => {
    if (isPrintMode) {
      table.toggleAllRowsExpanded(true);
      setTimeout(() => {
        window.print();
      }, 100);
    }
  }, [isPrintMode, table]);

  return (
    <div>
      <DataTableToolbar
        table={table}
        allClients={allClients}
        allUsers={allUsers}
        handlePrintClick={handlePrintClick}
        hasFullAccess={hasFullAccess}
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="[&:nth-of-type(1)]:w-[80%]">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              if (row.depth === 0 && !row.getIsExpanded()) {
                row.toggleExpanded(true);
              }

              return (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
