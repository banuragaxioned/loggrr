import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";

export default async function Page() {
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Manage Project" text="Manage your project here"></DashboardHeader>
      </DashboardShell>
    </>
  );
}
