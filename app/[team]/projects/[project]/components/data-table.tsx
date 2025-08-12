"use client";

import { useEffect, useState } from "react";
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
import { Assignment } from "@/types";

export interface ClientAndUserInterface {
  id: number;
  name: string | null;
}

interface DataTableProps<TData, TValue> {
  columns: any;
  data: TData[];
  team: string;
}

const expandingRowFilter = (row: Row<Assignment>, filterValue: string) => {
  const regex = new RegExp(filterValue, "ig");
  return regex.test(row.original.name);
};

export function DataTable<TData, TValue>({ columns, data, team }: DataTableProps<TData, TValue>) {
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
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="[&:nth-of-type(2)]:mr-6 [&:nth-of-type(2)]:w-20">
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
              return (
                <TableRow
                  data-team={team}
                  className="group relative"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
