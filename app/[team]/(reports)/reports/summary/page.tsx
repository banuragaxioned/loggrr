import { DashboardShell } from "components/ui/shell";
import { DashboardHeader } from "components/ui/header";
import { getProjectSummary } from "server/services/project";
import type { Metadata } from "next";
import { pageProps } from "types";

export const metadata: Metadata = {
  title: `Summary`,
};

export default async function Page({ params }: pageProps) {
  const { team } = params;
  const data = await getProjectSummary(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Summary"></DashboardHeader>
      Coming soon
    </DashboardShell>
  );
}
