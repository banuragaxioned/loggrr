"use client";
import {useState,useEffect} from "react";
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
import dayjs from "dayjs";

export function Table<TData, TValue>({ columns }: TableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [startDate,setStartDate] = useState(new Date());
  const [data,setData] = useState([]);

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
    paginateExpandedRows: false,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  };

    //api call to get allocation data
    const getAllocation = async () => {
      const endDate = dayjs(startDate).add(14, "day").toDate();
      return await fetch("/api/team/allocation/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team:"axioned",
          startDate,
          endDate,
          page: 1,
          pageSize: 20,
        }),
      });
    };
    // getAllocation().then(res=>res.json()).then(res=>console.log(res))
  useEffect(()=>{
    getAllocation().then(res=>res.json()).then(res=>setData(res));
  },[startDate])

  return <DataTableStructure tableConfig={tableConfig} DataTableToolbar={DataTableToolbar} toolBarProps={{startDate,setStartDate}} />;
}
