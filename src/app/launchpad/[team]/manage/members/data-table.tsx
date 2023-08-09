"use client";

import { UserAvatar } from "@/components/user-avatar";

import * as React from "react";
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
import { ChevronsUpDown } from "lucide-react";
import { Member } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SingleSelectDropdown } from "@/components/ui/single-select-dropdown";

const columns: ColumnDef<Member | any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="text-slate-500"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "mail",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="text-slate-500"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="link"
          className="text-slate-500"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

export function DataTable<TData, TValue>({ team }:{team:string}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [data,setData] = React.useState<TData[]>([]);
  const [initialLoad,setInitialLoad] = React.useState<boolean>(false);
  const [status,setStatus] = React.useState<string>("ACTIVE");

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
  
  React.useEffect(()=>{
    fetch("/api/team/members",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ team }),
    }).then((res)=>res.json()).then((res)=>setData(res.members)).catch(e=>setData([]))
    setInitialLoad(true);
  },[]);

  return (
    <div>
      <div className="mb-3 flex items-center rounded-xl border-[1px] border-border p-[15px]">
      <SingleSelectDropdown
          selectionHandler={(value: string) => setStatus(value)}
          contentClassName="[&>div]hover:bg-hover"
          placeholder="Active"
          selectionOptions={[
            { title: "Active", value: "ACTIVE" },
            { title: "Archived", value: "INACTIVE" },
            { title: "All", value: "ALL" },
          ]}
          triggerClassName="w-[220px] 2xl:text-sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
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
            table.getRowModel().rows.map((row, i) => (
              (row.original.status.trim() === status || status === 'ALL') &&
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="group">
                {row.getVisibleCells().map((cell: any, j: number) => {
                  return (
                    <TableCell
                      className={`h-[43px] max-h-[43px] px-8 py-0 tabular-nums ${j < 1 ? "flex items-center" : ""}`}
                      key={cell.id}
                    >
                      {j < 1 && (
                        <UserAvatar
                          user={{ name: cell.row.original.name, image: cell.row.original.avatar }}
                          className="mr-2 inline-block h-5 w-5"
                        />
                      )}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) :
            !initialLoad ?
            (
              <>
              <TableRow>
                  {columns.map(()=>(
                   <TableCell>
                      <Skeleton className="w-40 h-4"/>
                </TableCell>
                  )
                  )}
              </TableRow>
               <TableRow>
               {columns.map(()=>(
                <TableCell>
                   <Skeleton className="w-40 h-4"/>
             </TableCell>
               )
               )}
           </TableRow>
           </>
            )
          :
           (
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
