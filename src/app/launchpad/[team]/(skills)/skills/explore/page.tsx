import { db } from "@/lib/db";
import { Tenant } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { NewSkillForm } from "@/components/skillForm";

async function getUserSkills(team: Tenant["slug"]) {
  const response = await db.skill.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      Tenant: {
        slug: team,
      },
    },
  });

  const flatResponse = response.map((skill) => {
    return {
      id: skill.id,
      name: skill.name,
    };
  });

  return flatResponse;
}

export default async function SkillsSummary({ params }: { params: { team: Tenant["slug"] } }) {
  const skills = await getUserSkills(params.team);
  const { team } = params;

  return (
    <DashboardShell>
      <DashboardHeader heading="All Skills" text="These are all the skills that are on our radar.">
        <NewSkillForm team={team} />
      </DashboardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell key={skill.id}>{skill.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardShell>
  );
}
