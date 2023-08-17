import { DashboardShell } from "@/components/ui/shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getProjectSummary } from "@/server/services/project";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { reportConfig } from "@/config/site";

export const metadata: Metadata = reportConfig.summary;

export default async function Page({ params }: pageProps) {
  const { team } = params;
  const data = await getProjectSummary(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Reports"></DashboardHeader>
      <DataTable columns={columns} data={data} />
    </DashboardShell>
  );
}
