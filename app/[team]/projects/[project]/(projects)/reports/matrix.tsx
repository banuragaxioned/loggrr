"use client";

import { Fragment, useState } from "react";

import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

export function ProjectMatrix({ data }: { data: MatrixData }) {
  const [mode, setMode] = useState<"hours" | "percent">("hours");

  const format = (value?: number) => {
    if (!value) return "—";
    if (mode === "hours") return `${value} h`;
    if (!data.grandTotal) return "—";
    return `${+((value / data.grandTotal) * 100).toFixed(1)}%`;
  };

  if (data.members.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
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

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">Category / Task</TableHead>
              {data.members.map((member) => (
                <TableHead key={member.id} className="text-right">
                  {member.name}
                </TableHead>
              ))}
              <TableHead className="text-right font-semibold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.categories.map((category) => (
              <Fragment key={category.id}>
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell>{category.name}</TableCell>
                  {data.members.map((member) => (
                    <TableCell key={member.id} className="text-right">
                      {format(category.cells[member.id])}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">{format(category.total)}</TableCell>
                </TableRow>
                {category.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="pl-8 text-muted-foreground">{task.name}</TableCell>
                    {data.members.map((member) => (
                      <TableCell key={member.id} className="text-right text-muted-foreground">
                        {format(task.cells[member.id])}
                      </TableCell>
                    ))}
                    <TableCell className="text-right text-muted-foreground">{format(task.total)}</TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="font-semibold">
              <TableCell>Total</TableCell>
              {data.members.map((member) => (
                <TableCell key={member.id} className="text-right">
                  {format(data.memberTotals[member.id])}
                </TableCell>
              ))}
              <TableCell className="text-right">{format(data.grandTotal)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
