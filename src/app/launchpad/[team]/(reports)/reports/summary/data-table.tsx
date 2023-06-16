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
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FancyBox, List } from "@/components/ui/fancybox";

import * as React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [selectedProjects, setSelectedProjects] = React.useState<List[]>([]);
  const [selectedClient, setSelectedClient] = React.useState<List[]>([]);
  const [selectedLead, setSelectedLead] = React.useState<List[]>([]);

  const dataFormator = (arr: never[], key: string, option?: null | string) => {
    return arr.map((obj: any) =>
      option ? !obj.lead && { label: obj[key], value: obj[key] } : obj.lead && { label: obj[key], value: obj[key] }
    );
  };

  const dataFilter = (arr: [] | any, key: string, option?: null | string) => {
    const formatedArr = dataFormator(arr, key, option);
    const processedData = formatedArr.filter((obj: any, i: number) => {
      const repeated = formatedArr.slice(i + 1, arr.length).find((item: any) => item?.label === obj?.label);
      if (!repeated && obj?.label) {
        return obj;
      }
    });
    return processedData;
  };

  const projectsNotEmpty = (key: string, value: string, selected: List[], i: number) => {
    let newClientStarted = false,
      flag = false;
    const searchArray = data.slice(i, data.length);

    searchArray.map((obj: any) => {
      obj.lead && selected.find((item) => obj[key] === item.value) && !newClientStarted
        ? (flag = true)
        : !obj.lead && obj[key] !== value
        ? (newClientStarted = true)
        : null;
    });
    return flag;
  };

  const filterMatcher = (rowObj: any, index: number) => {
    let check = false,flag=false;
    const projectName = rowObj.original.name;
    const lead = rowObj.original.name;
    const selectedReference = [selectedProjects.length && selectedProjects, selectedClient.length && selectedClient, selectedLead.length && selectedLead];
    selectedReference.map((item,i)=>{
      if(item) {
        flag = !rowObj.original.lead &&  projectsNotEmpty(i===2?"lead":"name", i === 2 ?rowObj.original.lead :rowObj.original.name, item, index);
        check = item.find((obj) => obj.value === (i===2 ? rowObj.original.lead :rowObj.original.name)) !== undefined
      }
    })
    return check || flag;
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
      <div className="mb-3 flex items-center gap-x-3 rounded-lg border-2 border-slate-200 p-[15px] py-2">
        <FancyBox
          options={dataFilter(data, "name")}
          selectedValues={selectedProjects}
          setSelectedValues={setSelectedProjects}
        />
        <FancyBox
          options={dataFilter(data, "name", "client")}
          selectedValues={selectedClient}
          setSelectedValues={setSelectedClient}
        />
        <FancyBox
          options={dataFilter(data, "lead")}
          selectedValues={selectedLead}
          setSelectedValues={setSelectedLead}
        />
        <Button variant="outline" className="ml-auto">
          <FolderPlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
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
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell: any) => {
                  return (
                    (filterMatcher(cell.row, i) || !selectedProjects.length) && (
                      <TableCell
                        className={`px-8 ${cell.row.original?.lead ? "" : "h-[69px] bg-slate-100 font-bold"}`}
                        key={cell.id}
                      >
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
