import { getClients } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Tenant } from "@prisma/client";
import { NewClientForm } from "@/components/clientForm";

export default async function Clients({ params }: { params: { team: Tenant["slug"] } }) {
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
