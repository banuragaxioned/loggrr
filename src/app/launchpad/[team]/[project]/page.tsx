import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";

export default async function Page() {
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Project Details page" text="This is your project details page."></DashboardHeader>
      </DashboardShell>
    </>
  );
}
