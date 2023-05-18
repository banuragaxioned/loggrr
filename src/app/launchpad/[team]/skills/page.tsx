import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/server/auth";
import { Tenant, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      skillLevel: true,
    },
  });

  const flatResponse = response.map((skill) => {
    return {
      id: skill.id,
      name: skill.Skill.name,
      level: skill.skillLevel,
    };
  });

  return flatResponse;
}

export default async function SkillsSummary({ params }: { params: { team: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const skills = await getUserSkills(user.id, params.team);
  console.log(skills);

  return (
    <>
      <h3>My Skills</h3>
      {/* <ul>
        {skills.map((skill) => (
          <li key={skill.id}>
            {skill.name} - {skill.level}
          </li>
        ))}
      </ul> */}
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
              <TableCell key={skill.id}>{skill.level}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
