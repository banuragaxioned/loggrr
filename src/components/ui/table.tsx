"use client";

import React, { useState, useEffect } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Archive } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helper";
import { EProjectTable } from "enums/project";

const TableUI = (props: any) => {
  const [columns, setColumns] = useState([]);
  const [columnHelper, setColumnHelper] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (props.columns && Array.isArray(props.columns) && props.columns.length) {
      setColumns(props.columns);

      const columnHelperConfig = createColumnHelper();
      const columnHelper = props.columns.map((item: any, index: number) => {
        return columnHelperConfig.accessor(item, {
          header: () => item,
          cell: (info) => info.renderValue(),
          footer: (info) => info.column.id,
        });
      });

      setColumnHelper(columnHelper);
    }
    if (props.rows && Array.isArray(props.rows) && props.rows.length) {
      setRows(props.rows);
    }
  }, [props]);

  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data: rows,
    columns: columnHelper,
    getCoreRowModel: getCoreRowModel(),
  });

  const thWidth = (id: string) => {
    switch (id) {
      case EProjectTable.name:
        return "w-[45%] pl-12";
      case EProjectTable.client:
        return "w-[10%]";
      case EProjectTable.status:
        return "w-[15%] text-center";
      case EProjectTable.owner:
        return "w-[20%]";
      case EProjectTable.archive:
        return "w-[5%] invisible";
      default:
        return "w-[10%]";
    }
  };

  const tdWidth = (id: string) => {
    switch (id) {
      case EProjectTable.name:
        return "w-[45%] pl-14";
      case EProjectTable.client:
        return "w-[10%]";
      case EProjectTable.status:
        return "w-[15%] text-center";
      case EProjectTable.owner:
        return "w-[20%]";
      case EProjectTable.archive:
        return "w-[5%]";
      default:
        return "w-[10%]";
    }
  };

  return (
    <div className="mb-3 w-full rounded-xl border border-slate-300">
      <table className="w-full min-w-[1000px] divide-y divide-zinc-300 dark:divide-zinc-700">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className={`${thWidth(header.id)} py-3.5 text-left text-sm font-semibold capitalize text-slate-500`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {table.getRowModel().rows.map((row) => (
            <>
              {/* <tr className="bg-slate-100">
                <th
                  colSpan={Object.keys(EProjectTable).length}
                  className="py-2 pl-12 text-left text-sm font-semibold text-slate-900"
                >
                  Axioned
                </th>
              </tr> */}
              <tr key={row.id} className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className={`${tdWidth(cell.column.id)} whitespace-nowrap py-2 text-sm`}>
                      <div
                        className={`flex items-center gap-2.5 ${
                          cell.column.id === EProjectTable.name ||
                          cell.column.id === EProjectTable.client ||
                          cell.column.id === EProjectTable.owner
                            ? "justify-start"
                            : "justify-center"
                        }`}
                      >
                        {cell.column.id === EProjectTable.archive ? (
                          <div className="invisible group-hover:visible">
                            <Archive className="h-4 w-4" />
                          </div>
                        ) : cell.column.id === EProjectTable.owner ? (
                          <>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" alt="hello"></AvatarImage>
                              <AvatarFallback className="text-xs">AB</AvatarFallback>
                            </Avatar>
                            <span className="inline-block">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </span>
                          </>
                        ) : (
                          <span className="inline-block">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableUI;
