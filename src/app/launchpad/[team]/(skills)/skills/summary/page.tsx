import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/server/auth";
import { Tenant } from "@prisma/client";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { getUserSkills } from "@/server/services/skill";
import { Overview } from "@/components/skillWidget";
import { SkillList } from "@/components/skillList";
import { getAllUsers } from "@/server/services/allocation";
import { AddSKill } from "@/components/forms/addSkillForm";

type Scores = {
  id: number;
  name: string;
  value: number;
  skillId: number,
}[];

export default async function SkillsSummary({ params }: { params: { team: Tenant["slug"] } }) {
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
      >
        <AddSKill team={params.team} currentUser={user.id} userSkills={skills} />
      </DashboardHeader>
      <Overview data={skills} />
      <SkillList props={skills} currentUser={user.id} team={params.team}/>
    </DashboardShell>
  );
}