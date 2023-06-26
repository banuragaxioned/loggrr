"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

import * as React from "react";
import { DatePicker } from "@/components/datePicker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [startDate, setStartDate] = React.useState<Date>();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const [activeRow,setActiveRow] = React.useState(null);

  const isVisible = (rowObj: any)=> rowObj.original.userName === activeRow || !rowObj.original.userName;

  const clickHandler = (rowObj:any)=> !rowObj?.original?.userName && setActiveRow((prev)=>prev !== rowObj?.original?.name ? rowObj?.original?.name :"")

  return (
    <div>
      <div className="mb-3 flex items-center gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
        <DatePicker date={startDate} setDate={setStartDate}/>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(
              (row:any) =>
                (isVisible(row)) && (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} 
                  onClick={()=>clickHandler(row)}
                  className={!row.original.userName ? "cursor-pointer":"transition-all duration-300 ease-in-out"}
                  >
                    {row.getVisibleCells().map((cell:any,i:number) => (
                      <TableCell className={`px-8 py-0 tabular-nums h-[43px] max-h-[43px] ${i<1 ? row.original.userName ? "indent-9 relative before:absolute before:block before:content-[''] before:w-1 before:bg-slate-600":"flex items-center":""}`} key={cell.id}>
                        { i<1 &&  !cell.row.original.userName &&
                          <UserAvatar
                          user={{ name: cell.row.original.name, image: cell.row.original.userAvatar }}
                          className="mr-2 inline-block h-5 w-5"
                        />
                        }
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
