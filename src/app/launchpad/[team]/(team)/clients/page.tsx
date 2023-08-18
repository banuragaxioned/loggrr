import { getClients } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewClientForm } from "@/components/forms/clientForm";
import type { Metadata } from "next";
import { pageProps } from "@/types";

export const metadata: Metadata = {
  title:`Clients`
};

export default async function Clients({ params }: pageProps) {
  const { team } = params;
  const clientList = await getClients(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Clients" text="This is a list of all clients">
        <NewClientForm team={team} />
      </DashboardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientList.map((client) => (
            <TableRow key={client.id}>
              <TableCell key={client.id}>{client.name}</TableCell>
              <TableCell key={client.id}>{client.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardShell>
  );
}
