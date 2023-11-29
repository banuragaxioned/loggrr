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

  return (
    <>
      <header className="container sticky top-0 z-40 mx-auto flex h-16 w-full items-center space-x-4 border-b border-b-zinc-200 bg-white px-4 dark:border-b-zinc-700 dark:bg-zinc-950 sm:justify-between sm:space-x-0">
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">{teamData && <TeamSwitcher teams={teamData} />}</nav>
        </div>
      </header>
      <div className="container mx-auto w-full items-center p-4">{children}</div>
    </>
  );
}
