"use client";

import { Hourglass, FolderPlus } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";

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
import { FancyBox, List } from "@/components/ui/fancybox";
import { Archive, ChevronsUpDown } from "lucide-react";

import * as React from "react";

interface DataTableProps<TData, TValue> {
  data: TData[]|any;
}

const columns: ColumnDef<any>[] = [
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
  

export function DataTable<TData, TValue>({ data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [selectedProjects, setSelectedProjects] = React.useState<List[]>([]);
  const [selectedClient, setSelectedClient] = React.useState<List[]>([]);
  const [selectedLead, setSelectedLead] = React.useState<List[]>([]);

  const dataFormator = (arr: never[], key: string) => {
    return arr.map((obj: any) => ({ label: obj[key], value: obj[key] }));
  };

  const dataFilter = (arr: [] | any, key: string) => {
    const formatedArr = dataFormator(arr, key);
    const processedData = formatedArr.filter((obj: any, i: number) => {
      const repeated = formatedArr.slice(i + 1, arr.length).find((item: any) => item?.label === obj?.label);
      if (!repeated && obj?.label) {
        return obj;
      }
    });
    return processedData;
  };

  const filterMatcher = (rowObj: any) => {
    let check = true;
    const projectName = rowObj.original.name;
    const lead = rowObj.original.projectOwner;
    const client = rowObj.original.clientName;
    const selectedReference = [
      selectedProjects.length && selectedProjects,
      selectedClient.length && selectedClient,
      selectedLead.length && selectedLead,
    ];
    selectedReference.map((item, i) => {
      if (item) {
        check =
          check && item.find((obj) => obj.value === (i === 2 ? lead : i === 1 ? client : projectName)) !== undefined;
      }
    });
    return check;
  };

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

  return (
    <div>
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
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="group">
                {row.getVisibleCells().map((cell: any, j: number) => {
                  return (
                    (filterMatcher(cell.row) ||
                      (!selectedProjects.length && !selectedClient.length && !selectedLead.length)) && (
                      <TableCell
                        className={`h-[43px] max-h-[43px] px-8 py-0 tabular-nums ${
                          j <1 ? "flex items-center" : ""
                        }`}
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
                    )
                  );
                })}
              </TableRow>
            ))
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
