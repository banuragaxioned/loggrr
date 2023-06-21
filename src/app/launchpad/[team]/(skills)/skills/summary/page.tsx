import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/server/auth";
import { Tenant, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";

async function getUserSkills(userId: User["id"], team: Tenant["slug"]) {
  const response = await db.skillScore.findMany({
    select: {
      id: true,
      Skill: {
        select: {
          id: true,
          name: true,
        },
      },
      level: true,
    },
    where: {
      Tenant: {
        slug: team,
      },
      User: {
        id: userId,
      },
    },
  });

  console.log(response);

  const flatResponse = response.map((skill) => {
    return {
      id: skill.id,
      name: skill.Skill.name,
      level: skill.level,
    };
  });

  return flatResponse;
}

export default async function SkillsSummary({ params }: { params: { team: Tenant["slug"] } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const skills = await getUserSkills(user.id, params.team);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Skills"
        text="This is a summary of your skills that you have been assessed on."
      ></DashboardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead>Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell key={skill.id}>{skill.name}</TableCell>
              <TableCell key={skill.id}>{skill.level}/5</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardShell>
  );
}
