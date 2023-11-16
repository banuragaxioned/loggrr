import { getClients } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { NewClientForm } from "@/components/forms/clientForm";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { Table } from "./table";
import  columns  from "./columns";

export const metadata: Metadata = {
  title: `Clients`,
};

export default async function Clients({ params }: pageProps) {
  const { team } = params;
  const clientList = await getClients(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Clients" text="This is a list of all clients">
        <NewClientForm team={team} />
      </DashboardHeader>
      {clientList && <Table columns={columns} data={clientList} />}
    </DashboardShell>
  );
}
