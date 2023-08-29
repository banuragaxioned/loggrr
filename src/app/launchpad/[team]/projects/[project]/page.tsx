import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/server/db";
import { notFound } from "next/navigation";
import { pageProps, projectProps } from "@/types";

export default async function Page({ params }: projectProps) {
  const user = await getCurrentUser();
  const { team, project } = params;

  console.log(params, project);
  

  if (!user) {
    return notFound();
  }

  const hasAccess = await prisma.project.findMany({
    where: {
      Tenant: {
        slug: team,
      },
     id: Number(project),
    },
  });

  if (hasAccess && hasAccess.length !== 1) {
    return notFound();
  }


  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Project Details page" text="This is your project details page."></DashboardHeader>
      </DashboardShell>
    </>
  );
}
