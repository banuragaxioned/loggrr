import React, { useState, useEffect } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

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
  return (
    <>
      <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-700">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold capitalize sm:pl-0">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
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
