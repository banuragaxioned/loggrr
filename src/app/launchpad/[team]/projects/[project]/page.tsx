import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/server/db";
import { notFound } from "next/navigation";
import { projectProps } from "@/types";

export default async function Page({ params }: projectProps) {
  const user = await getCurrentUser();
  const { team, project } = params;

  if (!user) {
    return notFound();
  }

  const hasAccess = await prisma.project.findUnique({
    select: {
      id: true,
      name: true,
      status: true,
    },
    where: {
      Tenant: {
        slug: team,
      },
      id: +project,
    },
  });

  if (!hasAccess) {
    return notFound();
  }

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading={hasAccess.name} text="This is your project details page."></DashboardHeader>
      </DashboardShell>
    </>
  );
}
