"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Circle, Minus, Plus } from "lucide-react";

import { getRandomColor } from "@/lib/random-colors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user-avatar";

export interface Logged {
  id: number;
  name: string;
  type?: "client" | "project" | "category" | "member" | "entry";
  hours?: number;
  budget?: number | null;
  interval?: "FIXED" | "MONTHLY";
  description?: string;
  image?: string;
  billable?: boolean;
  task?: string | null;
  subRows?: {
    id: number;
    name: string;
    hours?: number;
  }[];
}

function BudgetCell({
  budget,
  hours,
  showBudgetHours,
}: {
  budget?: number | null;
  hours: number;
  showBudgetHours: boolean;
}) {
  const hasBudget = typeof budget === "number" && budget > 0;

  if (!hasBudget) {
    return <span className="inline-block w-44 text-right opacity-50">—</span>;
  }

  const utilization = Math.round((hours / budget) * 100);
  const isOver = utilization > 100;

  return (
    <span className="inline-block w-44 text-right">
      {showBudgetHours && (
        <span className="mr-1">
          <span className="text-xs opacity-50">Total:</span> {budget} h
        </span>
      )}
      <span className={`${isOver ? "text-destructive" : ""}`}>
        <span className="text-xs opacity-50">Used:</span> {utilization}%
      </span>
    </span>
  );
}

export const columns: ColumnDef<Logged>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, getValue }) => {
      const { depth, original } = row;
      const type = original.type;
      const canExpand = row.getCanExpand();
      const isExpanded = row.getIsExpanded();
      const value = getValue() as string;

      return (
        <div className="ml-8 flex items-center gap-2" style={{ marginLeft: `${depth * 32}px` }}>
          {canExpand && type !== "client" && type !== "entry" && (
            <Button
              {...{
                onClick: row.getToggleExpandedHandler(),
              }}
              variant="outline"
              className="z-10 h-6 w-6 shrink-0 p-0"
            >
              {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
            </Button>
          )}
          <div
            className={`${type === "client" ? "font-medium" : ""} ${type === "entry" ? "descendent" : ""} relative flex items-center gap-2`}
          >
            {type === "client" && (
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-white"
                style={{ backgroundColor: getRandomColor(original.id) }}
              >
                {value.charAt(0)}
              </span>
            )}
            {type === "member" && (
              <UserAvatar
                user={{ name: original.name ?? null, image: original.image ?? null }}
                className="h-6 w-6 bg-slate-300"
              />
            )}
            <span className={`${type === "entry" ? "w-full md:w-[200px]" : "w-full"} line-clamp-1 shrink-0`}>
              {value}
            </span>
            {type === "entry" && (
              <span className="hidden items-center gap-2 md:inline-flex">
                {original.task && (
                  <Badge variant="secondary" className="shrink-0 font-normal">
                    {original.task}
                  </Badge>
                )}
                <span className="line-clamp-1 opacity-50" title={original.description ?? undefined}>
                  {original?.description ?? ""}
                </span>
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "hours",
    header: () => <span className="inline-block w-20 text-right">Hours</span>,
    cell: ({ row }) => {
      const { depth, original } = row;
      const formatted = `${row.getValue("hours") ?? 0} h`;

      return (
        <span className={`text-bold relative inline-block w-20 text-right ${depth === 0 ? "font-semibold" : ""}`}>
          <span className={`${depth > 1 ? "opacity-50" : ""} mr-1 sm:mr-0`}>{formatted}</span>
          {original.billable && (
            <Circle className="fill-success absolute top-1/2 -right-3 h-2.5 w-2.5 -translate-y-1/2 stroke-none sm:-right-3.5 md:-right-4" />
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "budget",
    header: () => <span className="inline-block w-44 text-right">Budget</span>,
    cell: ({ row }) => {
      const { original } = row;
      if (original.type !== "project" && original.type !== "member") {
        return <span className="inline-block w-44" />;
      }

      const hours = (row.getValue("hours") as number) ?? 0;

      return <BudgetCell budget={original.budget} hours={hours} showBudgetHours={original.type === "project"} />;
    },
  },
];
