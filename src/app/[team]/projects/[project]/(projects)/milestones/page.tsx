import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";

export default async function Page({ params }: pageProps) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Milestones" text="Manage all the Milestones for your project">
        <Button variant="outline">Edit</Button>
      </DashboardHeader>
    </DashboardShell>
  );
}
