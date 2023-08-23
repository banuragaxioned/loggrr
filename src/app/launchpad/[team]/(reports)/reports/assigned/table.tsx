"use client";
import {useState} from "react";
import { DataTableStructure } from "@/components/data-table-structure";
import { TableProps } from "@/types";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  ExpandedState,
  getExpandedRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./toolbar";
// import {useSelectedDate} from '@/hooks/useSelectedDate';

export function Table<TData, TValue>({ columns, data=[] }: TableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({})
  // const {startDateContext} = useSelectedDate();
  // const startDate = useContext(startDateContext);

  const tableConfig = {
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      expanded,
    },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getExpandedRowModel: getExpandedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSubRows: (row: { subRows: any; }) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    paginateExpandedRows: true,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  };

  // useEffect(()=>{
  //   console.log(startDate)
  // },[startDate])

  return <DataTableStructure tableConfig={tableConfig} DataTableToolbar={DataTableToolbar} />;
}
