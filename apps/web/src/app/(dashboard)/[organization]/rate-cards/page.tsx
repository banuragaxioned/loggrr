"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { DashboardHeader, DashboardShell } from "@/components/shell";
import { CreateRateCardForm } from "./create-rate-card-form";
import { authClient } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/currency";

interface RateCard {
  id: number;
  positionId: number;
  positionName: string;
  rate: string;
  currency: string;
}

interface Member {
  data: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
    createdAt: Date;
    userId: string;
    organizationId: string;
    role: string;
    teamId?: string;
  };
}

const columns: ColumnDef<RateCard>[] = [
  {
    id: "positionName",
    accessorKey: "positionName",
    header: ({ column }: { column: Column<RateCard, unknown> }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<RateCard["positionName"]>()}</div>,
    meta: {
      label: "Position",
      placeholder: "Search positions...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "rate",
    accessorKey: "rate",
    header: ({ column }: { column: Column<RateCard, unknown> }) => (
      <DataTableColumnHeader column={column} title="Rate" />
    ),
    cell: ({ row }) => {
      const rate = row.original.rate;
      const currency = row.original.currency;
      return <div>{formatCurrency(rate, currency)}/hr</div>;
    },
    meta: {
      label: "Rate",
      placeholder: "Search rates...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
];

export default function RateCardsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [member, setMember] = useState<Member | null>(null);

  const rateCards = useQuery({
    ...trpc.position.getRateCards.queryOptions(),
    placeholderData: [],
  });

  const { table } = useDataTable({
    data: rateCards.data ?? [],
    columns,
    pageCount: Math.ceil((rateCards.data?.length ?? 0) / 20),
  });

  useEffect(() => {
    async function fetchMember() {
      try {
        const response = await authClient.organization.getActiveMember();
        if (response?.data?.id) {
          setMember(response as Member);
        }
      } catch (error) {
        console.error("Failed to fetch member:", error);
      }
    }
    fetchMember();
  }, []);

  if (rateCards.isLoading || !member) {
    return (
      <div className="flex h-full items-center justify-center pt-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!member?.data?.id) {
    return <div>Member not found</div>;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Rate Cards" text="You can find the list of rate cards here">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Rate Card
        </Button>
      </DashboardHeader>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreateRateCardForm
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => rateCards.refetch()}
        memberId={member.data.id}
      />
    </DashboardShell>
  );
}
