import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";

export default async function Page({ params }: pageProps) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Manage Project team" text="People who are assigned to this project">
        <Button variant="outline">Edit</Button>
      </DashboardHeader>
    </DashboardShell>
  );
}
