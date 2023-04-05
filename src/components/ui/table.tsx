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
          header: () => item.toUpperCase(),
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
      <table className="border border-slate-400">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-slate-300">
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
                <td key={cell.id} className="border border-slate-300">
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
