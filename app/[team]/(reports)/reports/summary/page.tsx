import type { Metadata } from "next";

import { pageProps } from "@/types";
import { getProjectSummary } from "@/server/services/project";

import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";

export const metadata: Metadata = {
  title: `Summary`,
};

export default async function Page({ params }: pageProps) {
  const { team } = params;
  const data = await getProjectSummary(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Report Page" />
    </DashboardShell>
  );
}
