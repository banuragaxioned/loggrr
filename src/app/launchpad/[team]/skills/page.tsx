import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/server/auth";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

async function getUserSkills(userId: User["id"], team: string) {
  const response = await db.skill.findMany({
    select: {
      id: true,
      name: true,
      SkillScore: {
        select: {
          id: true,
          skillLevel: true,
        },
      },
    },
    where: {
      id: userId,
      Tenant: {
        slug: team,
      },
    },
  });

  const flatResponse = response.map((skill) => {
    return {
      id: skill.id,
      name: skill.name,
      level: skill.SkillScore.map((score) => score.skillLevel),
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
      <h3>Skills</h3>
      <ul>
        {skills.map((skill) => (
          <li key={skill.id}>
            {skill.name} - {skill.level}
          </li>
        ))}
      </ul>
    </>
  );
}
