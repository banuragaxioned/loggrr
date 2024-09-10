import { getClients } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { NewClientForm } from "@/components/forms/clientForm";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { Table } from "./table";
import { clientName } from "./columns";
import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `Clients`,
};

export default async function Clients({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;
  const workspaceRole = getUserRole(user?.workspaces, team);
  const hasAccess = checkAccess(workspaceRole);

  if (!hasAccess) {
    return notFound();
  }

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
