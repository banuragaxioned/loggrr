import { getCurrentUser } from "@/server/session";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/ui/shell";
import { DashboardShell } from "@/components/ui/shell";
import { getSkills, getUserSkills } from "@/server/services/skill";
import { Overview } from "@/components/charts/skills-radar";
import { SkillList } from "@/components/skill-list";
import { AddSKill } from "@/components/forms/addSkillForm";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { getAllUsers } from "@/server/services/allocation";

export const metadata: Metadata = {
  title: `Summary`,
};

type Scores = {
  id: number;
  name: string;
  value: number;
  skillId: number;
}[];

export default async function SkillsSummary({ params }: pageProps) {
  const user = await getCurrentUser();
  const users = await getAllUsers(params.team);
  const skillsList = await getSkills(params.team);

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const skills: Scores = await getUserSkills(user.id, params.team);

  return (
    <DashboardShell>
      <DashboardHeader heading="My Skills" text="This is a summary of your skills that you have been assessed on.">
        <AddSKill team={params.team} users={users} currentUser={user.id} skillsList={skillsList} userSkills={skills} />
      </DashboardHeader>
      {skills.length > 2 ? <Overview data={skills} /> : null}
      <SkillList props={skills} currentUser={user.id} team={params.team} />
    </DashboardShell>
  );
}
