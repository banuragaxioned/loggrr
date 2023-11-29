import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import type { Metadata } from "next";
import { pageProps } from "@/types";

export const metadata: Metadata = {
  title: `Manage Tasks`,
};

export default async function Page({ params }: pageProps) {
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Project Tasks" text="Manage your tasks here"></DashboardHeader>
      </DashboardShell>
    </>
  );
}
