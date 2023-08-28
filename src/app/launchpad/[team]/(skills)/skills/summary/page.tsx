import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { getSkills, getUserSkills } from "@/server/services/skill";
import { Overview } from "@/components/skillWidget";
import { SkillList } from "@/components/skillList";
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
      <Overview data={skills} />
      <SkillList props={skills} currentUser={user.id} team={params.team} />
    </DashboardShell>
  );
}
