"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Circle, Info, List, Minus, Plus } from "lucide-react";

import { getRandomColor } from "@/lib/random-colors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user-avatar";
import { CustomTooltip } from "@/components/custom/tooltip";

export interface Logged {
  id: number;
  name: string;
  type?: "client" | "project" | "category" | "member" | "entry";
  hours?: number;
  billableHours?: number;
  budget?: number | null;
  interval?: "FIXED" | "MONTHLY";
  description?: string;
  image?: string;
  billable?: boolean;
  task?: string | null;
  groups?: { id: number; name: string }[];
  subRows?: {
    id: number;
    name: string;
    hours?: number;
  }[];
}

function BudgetTooltipContent() {
  return (
    <div className="space-y-2.5 text-xs leading-relaxed">
      <div>
        <p className="font-medium">Monthly projects</p>
        <p className="text-muted-foreground">
          Billable hours are compared to a per-month budget (<span className="font-medium">h/m</span>). That cap is not
          multiplied by the number of months in your range.
        </p>
      </div>
      <div>
        <p className="font-medium">Fixed projects</p>
        <p className="text-muted-foreground">
          Billable hours in your selected date range are compared to the project&apos;s total hour budget.
        </p>
      </div>
      <p className="border-border text-muted-foreground border-t pt-2">
        <span className="text-foreground font-medium">Tip:</span> For monthly projects, select a single calendar month
        for the most accurate utilization.
      </p>
    </div>
  );
}

function BudgetCell({
  budget,
  billableHours,
  showBudgetHours,
  interval,
}: {
  budget?: number | null;
  billableHours: number;
  showBudgetHours: boolean;
  interval?: "FIXED" | "MONTHLY";
}) {
  const hasBudget = typeof budget === "number" && budget > 0;

  if (!hasBudget || billableHours <= 0 || budget === null || budget === 0) {
    return <span className="inline-block w-44 text-right opacity-50">—</span>;
  }

  const utilization = Math.round((billableHours / budget) * 100);
  const budgetUnit = interval === "MONTHLY" ? "h/m" : "h";

  if (showBudgetHours) {
    const delta = utilization - 100;
    const deltaLabel = delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : "0%";
    const deltaClass = delta > 0 ? "text-destructive" : delta < 0 ? "opacity-50" : "opacity-50";

    return (
      <span className="inline-block w-44 text-right text-xs">
        <span className="mr-1">
          {budget} {budgetUnit}
        </span>
        (<span className={deltaClass}>{deltaLabel}</span>)
      </span>
    );
  }

  return (
    <span className="inline-block w-44 text-right text-xs">
      <span className="opacity-50">{utilization}%</span>
    </span>
  );
}

function MemberGroups({ groups }: { groups: { id: number; name: string }[] }) {
  if (groups.length === 0) {
    return null;
  }

  const [firstGroup, ...remainingGroups] = groups;
  const hasMoreGroups = remainingGroups.length > 0;

  const groupLabel = (
    <Badge
      variant="outline"
      className="inline-flex max-w-[10rem] border-sky-200 bg-sky-50 font-normal text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300"
      title={groups.map((group) => group.name).join(", ")}
    >
      <span className="truncate">{firstGroup.name}</span>
      {hasMoreGroups && (
        <>
          <span className="mx-1 shrink-0 opacity-40">|</span>
          <span className="shrink-0">+{remainingGroups.length}</span>
        </>
      )}
    </Badge>
  );

  if (!hasMoreGroups) {
    return groupLabel;
  }

  return (
    <CustomTooltip
      trigger={groupLabel}
      content={
        <div className="flex flex-col gap-1 text-xs">
          {groups.map((group) => (
            <span key={group.id}>{group.name}</span>
          ))}
        </div>
      }
      contentClassName="max-w-[200px]"
      sideOffset={4}
    />
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
        <div className="ml-8 flex min-w-0 items-center gap-2" style={{ marginLeft: `${depth * 32}px` }}>
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
          {type === "member" ? (
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <UserAvatar
                user={{ name: original.name ?? null, image: original.image ?? null }}
                className="h-6 w-6 shrink-0 bg-slate-300"
              />
              <span className="min-w-0 flex-1 truncate">{value}</span>
              <MemberGroups groups={original.groups ?? []} />
            </div>
          ) : (
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
              <span className={`${type === "entry" ? "w-full md:w-[200px]" : "w-full"} line-clamp-1 shrink-0`}>
                {value}
              </span>
              {type === "entry" && (
                <span className="hidden items-center gap-2 md:inline-flex">
                  {original.task && (
                    <Badge
                      variant="secondary"
                      className="inline-flex shrink-0 items-center font-normal"
                      title={`Task: ${original.task}`}
                    >
                      <List size={12} className="mr-1 shrink-0" />
                      {original.task}
                    </Badge>
                  )}
                  <span className="line-clamp-1 opacity-50" title={original.description ?? undefined}>
                    {original?.description ?? ""}
                  </span>
                </span>
              )}
            </div>
          )}
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
    header: () => (
      <span className="inline-flex w-44 items-center justify-end gap-1">
        Budget
        <CustomTooltip
          trigger={<Info size={14} className="text-muted-foreground" />}
          content={<BudgetTooltipContent />}
          contentClassName="max-w-[320px]"
          sideOffset={4}
        />
      </span>
    ),
    cell: ({ row }) => {
      const { original } = row;
      if (original.type !== "project" && original.type !== "member") {
        return <span className="inline-block w-44" />;
      }

      const billableHours = original.billableHours ?? 0;

      return (
        <BudgetCell
          budget={original.budget}
          billableHours={billableHours}
          showBudgetHours={original.type === "project"}
          interval={original.interval}
        />
      );
    },
  },
];
