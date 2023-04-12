import React, { useState, useEffect } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

type TableColumn = {
  id: string;
  accessor: string;
};

type TableProps = {
  columns: TableColumn[];
  rows: any[];
};

const TableUI = ({ columns, rows }: TableProps) => {
  const [columnHelper, setColumnHelper] = useState<any[]>([]);
  const [tableRows, setTableRows] = useState<any[]>([]);

  useEffect(() => {
    if (columns && Array.isArray(columns) && columns.length) {
      const columnHelperConfig = createColumnHelper();
      const columnHelper = columns.map((item: any, index: number) => {
        return columnHelperConfig.accessor(item, {
          id: item.id,
          header: () => item,
          cell: (info: any) => info.renderValue(),
          footer: (info: any) => info.column.id,
        });
      });

      setColumnHelper(columnHelper);
    }
    if (rows && Array.isArray(rows) && rows.length) {
      setTableRows(rows);
    }
  }, [columns, rows]);

  const table = useReactTable({
    data: tableRows,
    columns: columnHelper,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table className="w-full border border-zinc-400">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-zinc-300 px-4 py-2 text-left capitalize">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-zinc-300 px-4 py-2 text-left">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableUI;
