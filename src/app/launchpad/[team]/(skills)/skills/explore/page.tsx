import { Tenant } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { NewSkillForm } from "@/components/forms/skillForm";
import { getSkills } from "@/server/services/skill";

export default async function SkillsSummary({ params }: { params: { team: Tenant["slug"] } }) {
  const skills = await getSkills(params.team);
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
