import { DashboardHeader } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardShell } from "@/components/ui/shell";
import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";

export default function ManageTeam() {
  const { isLoading, isInvalid, slug } = useValidateTeamAccess();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="container mx-auto grid gap-12 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex">Sidebar </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        <DashboardShell>
          <DashboardHeader heading="Team settings" text="Manage your team and workspace" />
          <div className="grid gap-8 p-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="team_name">Team Name</Label>
              <Input type="team_name" id="team_name" defaultValue={slug} required placeholder="Team Name" />
              <p className="text-sm text-zinc-500">Keep it short and easily recognizable.</p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="slug">Slug</Label>
              <div className="mt-2 flex rounded-md shadow-sm">
                <span className="inline-flex select-none items-center rounded-l-md border border-r-0 border-zinc-300 px-3 text-sm dark:border-zinc-700 sm:text-sm">
                  loggr.com/
                </span>
                <Input type="slug" id="slug" defaultValue={slug} className="rounded-l-none" required />
              </div>
              <p className="text-sm text-zinc-500">This appears in your URL as well.</p>
            </div>
          </div>
        </DashboardShell>
      </main>
    </div>
  );
}
