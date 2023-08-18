import { getProjects } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Metadata } from "next";
import { pageProps } from "@/types";

export const metadata: Metadata = {
  title: `Projects`,
};
export default async function Projects({ params }: pageProps) {
  const { team } = params;
  const clientList = await getProjects(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="This is all your projects">
        {/* TODO: Add Project Form here */}
      </DashboardHeader>
      {/* TODO: Update to Advanced Table, with sort (all), select columns to display */}
      {/* TODO: Clicking on the row should take you to the project details page */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientList.map((project) => (
            <TableRow key={project.id}>
              <TableCell key={project.id}>{project.name}</TableCell>
              <TableCell key={project.id}>{project.Client.name}</TableCell>
              <TableCell key={project.id}>{project.Owner.name}</TableCell>
              <TableCell key={project.id}>{project.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardShell>
  );
}
