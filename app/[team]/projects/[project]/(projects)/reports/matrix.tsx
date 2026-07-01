"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type ColumnDef,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Cells = Record<number, number>;

export type MatrixData = {
  members: { id: number; name: string | null }[];
  grandTotal: number;
  memberTotals: Cells;
  categories: {
    id: string;
    name: string;
    total: number;
    cells: Cells;
    tasks: { id: string; name: string; total: number; cells: Cells }[];
  }[];
};

type MatrixRow = { id: string; name: string; total: number; cells: Cells; subRows?: MatrixRow[] };

const firstName = (name: string | null) => name?.trim().split(/\s+/)[0] ?? "—";

const stickyFirstColWidth = "w-[260px] min-w-[260px] max-w-[260px]";
const stickyFirstCol = "sticky left-0 z-[2] border-r border-border bg-background";
const stickyFirstColMuted = "sticky left-0 z-[2] border-r border-border bg-muted";
const stickyFirstColHeader = "sticky left-0 z-[3] border-r border-border bg-background";
const dataCell = "whitespace-nowrap px-3 tabular-nums";

export function ProjectMatrix({ data }: { data: MatrixData }) {
  const [mode, setMode] = useState<"hours" | "percent">("percent");
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const format = useCallback(
    (value?: number) => {
      if (!value) return "—";
      if (mode === "hours") return `${value}\u00a0h`;
      if (!data.grandTotal) return "—";
      return `${Math.round((value / data.grandTotal) * 100)}%`;
    },
    [mode, data.grandTotal],
  );

  const rows = useMemo<MatrixRow[]>(
    () =>
      data.categories.map((category) => ({
        id: category.id,
        name: category.name,
        total: category.total,
        cells: category.cells,
        subRows: category.tasks,
      })),
    [data.categories],
  );

  const columns = useMemo<ColumnDef<MatrixRow>[]>(
    () => [
      {
        id: "name",
        header: "Category / Task",
        cell: ({ row }) => {
          const canExpand = row.getCanExpand();
          return (
            <div className="flex min-w-0 items-center gap-2" style={{ paddingLeft: `${row.depth * 24}px` }}>
              {canExpand ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 shrink-0 p-0"
                  onClick={row.getToggleExpandedHandler()}
                >
                  {row.getIsExpanded() ? <Minus size={14} /> : <Plus size={14} />}
                </Button>
              ) : (
                <span className="w-6 shrink-0" />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn("min-w-0 flex-1 truncate", row.depth === 0 ? "font-medium" : "text-muted-foreground")}
                  >
                    {row.original.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right">{row.original.name}</TooltipContent>
              </Tooltip>
            </div>
          );
        },
      },
      ...data.members.map<ColumnDef<MatrixRow>>((member) => ({
        id: `member-${member.id}`,
        header: () => (
          <span className="block text-right whitespace-nowrap" title={member.name ?? undefined}>
            {firstName(member.name)}
          </span>
        ),
        cell: ({ row }) => (
          <span className={cn("block text-right", row.depth > 0 && "text-muted-foreground")}>
            {format(row.original.cells[member.id])}
          </span>
        ),
      })),
      {
        id: "total",
        header: () => <span className="block text-right font-semibold whitespace-nowrap">Total</span>,
        cell: ({ row }) => (
          <span className={cn("block text-right", row.depth > 0 && "text-muted-foreground")}>
            {format(row.original.total)}
          </span>
        ),
      },
    ],
    [data.members, format],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  if (data.members.length === 0) {
    return (
      <p className="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm">
        No time logged in the selected period.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <div className="inline-flex items-center gap-0.5 rounded-md border p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setMode("hours")}
            className={cn("rounded px-2 py-1", mode === "hours" ? "bg-muted font-medium" : "text-muted-foreground")}
          >
            Hours
          </button>
          <button
            type="button"
            onClick={() => setMode("percent")}
            className={cn("rounded px-2 py-1", mode === "percent" ? "bg-muted font-medium" : "text-muted-foreground")}
          >
            % of total
          </button>
        </div>
      </div>

      <Table className="w-max min-w-full border-separate border-spacing-0">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    dataCell,
                    header.id === "name"
                      ? cn(stickyFirstColWidth, stickyFirstColHeader, "pr-4 text-left whitespace-nowrap")
                      : "min-w-18 text-right",
                  )}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className={row.depth === 0 ? "bg-muted/50" : "bg-background"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    dataCell,
                    cell.column.id === "name"
                      ? cn(
                          stickyFirstColWidth,
                          row.depth === 0 ? stickyFirstColMuted : stickyFirstCol,
                          "overflow-hidden pr-4 text-left",
                        )
                      : cn(dataCell, "min-w-18 text-right"),
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-muted font-semibold">
            <TableCell className={cn(dataCell, stickyFirstColWidth, stickyFirstColMuted, "pr-4 whitespace-nowrap")}>
              Total
            </TableCell>
            {data.members.map((member) => (
              <TableCell key={member.id} className={cn(dataCell, "min-w-18 text-right")}>
                {format(data.memberTotals[member.id])}
              </TableCell>
            ))}
            <TableCell className={cn(dataCell, "min-w-18 text-right")}>{format(data.grandTotal)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
