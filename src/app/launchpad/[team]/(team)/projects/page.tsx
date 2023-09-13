import { getProjects } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { Table } from "./table";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { columns } from "./columns";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Projects`,
};
export default async function Projects({ params }: pageProps) {
  const { team } = params;
  const projectList = await getProjects(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="This is all your projects">
        <Link href="clients" rel="noreferrer" className={buttonVariants({ variant: "outline" })}>
          Manage Clients
        </Link>
        {/* TODO: Add Project Form here */}
      </DashboardHeader>
      <Table columns={columns} data={projectList} />
    </DashboardShell>
  );
}
