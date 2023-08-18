import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import type { Metadata } from "next";
import { pageProps } from "@/types";

export const metadata: Metadata = {
  title:`Project`
};

export default async function Page({ params }: pageProps) {
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Manage Project" text="Manage your project here"></DashboardHeader>
      </DashboardShell>
    </>
  );
}
