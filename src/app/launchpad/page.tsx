import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { MyTeams } from "@/components/myTeams";

export const metadata = {
  title: "Launchpad",
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts."></DashboardHeader>
      <div>
        <MyTeams />
      </div>
    </DashboardShell>
  );
}
