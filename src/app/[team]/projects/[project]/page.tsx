import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";

export default async function Page({ params }: pageProps) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Project Details page" text="This is your project details page.">
        <Button variant="outline">Edit</Button>
      </DashboardHeader>
    </DashboardShell>
  );
}
