import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import TeamSwitcher from "@/app/team-switcher";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const teamData = user?.tenants;

  if (!user) {
    return notFound();
  }

  return <>{teamData && <TeamSwitcher teams={teamData} />}</>;
}
