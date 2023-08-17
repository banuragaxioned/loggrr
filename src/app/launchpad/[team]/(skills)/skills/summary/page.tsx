import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/server/auth";
import { Tenant } from "@prisma/client";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { getUserSkills } from "@/server/services/skill";
import { Overview } from "@/components/skillWidget";
import { SkillList } from "@/components/skillList";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { skillConfig } from "@/config/site";

export const metadata: Metadata = skillConfig.explore;

type Scores = {
  id: number;
  name: string;
  level: number;
}[];

export default async function SkillsSummary({ params }: pageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const skills: Scores = await getUserSkills(user.id, params.team);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Skills"
        text="This is a summary of your skills that you have been assessed on."
      ></DashboardHeader>
      <Overview data={skills} />
      <SkillList props={skills} currentUser={user.id} team={params.team} />
    </DashboardShell>
  );
}
