import { DashboardHeader } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardShell } from "@/components/ui/shell";
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";

export default function TenantSettings() {
  const { isLoading, isInvalid, slug } = useValidateTenantAccess();

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
          <DashboardHeader heading="Team settings" text="Manage your team and settings here" />
          <div className="grid gap-10 p-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="slug">Team Name</Label>
              <Input type="team_name" id="team_name" defaultValue={slug} required />
              <p className="text-sm text-slate-500">Keep it short and easily recognizable.</p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input type="slug" id="slug" defaultValue={slug} disabled />
              <p className="text-sm text-slate-500">This appears in your URL as well.</p>
            </div>
          </div>
        </DashboardShell>
      </main>
    </div>
  );
}
