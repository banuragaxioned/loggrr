import React, { useState, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// const columnHelper = createColumnHelper<Person>();
// TODO: This needs to generated based on the props

// const columns = [
//   columnHelper.accessor("name", {
//     header: () => "Name",
//     cell: (info) => info.getValue(),
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("age", {
//     header: () => "Age",
//     cell: (info) => info.renderValue(),
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("visits", {
//     header: () => <span>Visits</span>,
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("status", {
//     header: "Status",
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("progress", {
//     header: "Profile Progress",
//     footer: (info) => info.column.id,
//   }),
// ];

const TableUI = (props: any) => {
  console.log(props);

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [data, setData] = React.useState(() => [...props.rows]);

  useEffect(() => {
    if (props.column && Array.isArray(props.columns) && props.columns.length) {
      setColumns(props.columns);
    }
    if (props.rows && Array.isArray(props.rows) && props.rows.length) {
      setRows(props.rows);
    }
  }, [props]);

  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
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
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
