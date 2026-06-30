"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Briefcase } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Status } from "@/generated/prisma/browser";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import StatusDropdown from "./status-dropdown";

export type Projects = {
  id: number;
  name: string | null | undefined;
  status: Status;
  interval: "FIXED" | "MONTHLY";
  billable: boolean;
  clientName: string;
  clientId: number;
  budget?: number;
  logged?: number;
  owner: string | null;
  ownerImage: string | null;
};

const detailBadgeClass = "justify-center px-1.5 text-xs font-medium";

// Width per column = longest label in that group (Published, Monthly, Non-billable).
const STATUS_COL = "w-[4.875rem]";
const INTERVAL_COL = "w-[4.25rem]";
const TYPE_COL = "w-[6.5rem]";

const DETAILS_GRID = "inline-grid grid-cols-[4.875rem_4.25rem_6.5rem] items-center gap-x-2";

function ProjectDetailsHeader() {
  return (
    <div className={cn(DETAILS_GRID, "text-muted-foreground text-xs font-medium")}>
      <span className={cn(STATUS_COL, "text-center")}>Status</span>
      <span className={cn(INTERVAL_COL, "text-center")}>Interval</span>
      <span className={cn(TYPE_COL, "text-center")}>Type</span>
    </div>
  );
}

function ProjectStatusBadge({ status }: { status: Status }) {
  const isPublished = status === "PUBLISHED";

  return (
    <Badge
      variant="outline"
      className={cn(
        detailBadgeClass,
        STATUS_COL,
        "capitalize",
        isPublished
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {isPublished ? "Published" : "Archived"}
    </Badge>
  );
}

function ProjectIntervalBadge({ interval }: { interval: "FIXED" | "MONTHLY" }) {
  const isMonthly = interval === "MONTHLY";

  return (
    <Badge
      variant="outline"
      className={cn(
        detailBadgeClass,
        INTERVAL_COL,
        isMonthly
          ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300"
          : "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
      )}
    >
      {isMonthly ? "Monthly" : "Fixed"}
    </Badge>
  );
}

function ProjectBillableBadge({ billable }: { billable: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        detailBadgeClass,
        TYPE_COL,
        billable
          ? "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {billable ? "Billable" : "Non-billable"}
    </Badge>
  );
}

function ClientBadge({ name }: { name: string }) {
  return (
    <Badge
      variant="outline"
      className="max-w-[220px] border-amber-200 bg-amber-50 font-normal text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
    >
      <Briefcase className="mr-1 h-3 w-3 shrink-0" />
      <span className="truncate">{name}</span>
    </Badge>
  );
}

export const columns: ColumnDef<Projects>[] = [
  {
    accessorKey: "name",
    meta: {
      className: "min-w-[240px] max-w-[360px]",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    filterFn: (row, _id, value) => {
      const query = String(value).toLowerCase().trim();
      if (!query) return true;

      const projectName = (row.original.name ?? "").toLowerCase();
      const clientName = row.original.clientName.toLowerCase();

      return projectName.includes(query) || clientName.includes(query);
    },
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
    cell: ({ row }) => <ClientBadge name={row.original.clientName} />,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "owner",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Project Owner" />,
    cell: ({ row }) => {
      const owner = row.original.owner;

      if (!owner) {
        return <span className="text-muted-foreground text-sm">Unassigned</span>;
      }

      return (
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar
            user={{
              name: owner,
              image: row.original.ownerImage ?? "",
            }}
            className="h-6 w-6 shrink-0 bg-slate-300"
          />
          <span className="truncate text-sm">{owner}</span>
        </div>
      );
    },
    filterFn: "arrIncludesSome",
  },
  {
    id: "details",
    enableSorting: false,
    meta: {
      className: "w-fit whitespace-nowrap",
    },
    header: () => <ProjectDetailsHeader />,
    cell: ({ row }) => {
      const { status, interval, billable } = row.original;

      return (
        <div className={DETAILS_GRID}>
          <ProjectStatusBadge status={status} />
          <ProjectIntervalBadge interval={interval} />
          <ProjectBillableBadge billable={billable} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, status } = row.original;
      return (
        <div
          className={cn("invisible flex items-center justify-end group-hover:visible")}
          onClick={(e) => e.stopPropagation()}
        >
          <StatusDropdown id={id} status={status} />
        </div>
      );
    },
    meta: {
      className: "w-[20px]",
    },
  },
];
