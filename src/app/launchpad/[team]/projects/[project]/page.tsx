import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import { projectProps } from "@/types";
import { projectAccess } from "@/server/services/project";

export default async function Page({ params }: projectProps) {
  const user = await getCurrentUser();
  const { project } = params;

  if (!user) {
    return notFound();
  }

  const projectValue = project && await projectAccess(Number(project.trim()))

  if (!projectValue) {
    return notFound();
  }

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading={projectValue.name} text="This is your project details page."></DashboardHeader>
      </DashboardShell>
    </>
  );
}
