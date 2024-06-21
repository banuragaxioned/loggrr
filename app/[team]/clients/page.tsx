import { getClients } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { NewClientForm } from "@/components/forms/clientForm";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { Table } from "./table";
import { clientName } from "./columns";

export const metadata: Metadata = {
  title: `Clients`,
};

export default async function Clients({ params }: pageProps) {
  const { team } = params;
  const clientList = await getClients(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Clients" text="You can find the list of clients here">
        <NewClientForm team={team} />
      </DashboardHeader>
      {clientList && <Table clientName={clientName} data={clientList} team={team} />}
    </DashboardShell>
  );
}
