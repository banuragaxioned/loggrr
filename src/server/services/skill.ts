import { Workspace, User } from "@prisma/client";
import { db } from "@/db";

export async function getSkills(team: Workspace["slug"]) {
  const response = await db.skill.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      Workspace: {
        slug: team,
      },
    },
  });

  const users = await db.skillScore.findMany({
    where: { Workspace: { slug: team } },
    select: {
      skillId: true,
      User: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const flatResponse = response.map((skill) => {
    const filteredUser = users.filter((user) => skill.id === user.skillId);

    return {
      id: skill.id,
      name: skill.name,
      users: filteredUser.length,
    };
  });

  return flatResponse;
}

export async function getUserSkills(userId: User["id"], team: Workspace["slug"]) {
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
      Workspace: {
        slug: team,
      },
      User: {
        id: userId,
      },
    },
  });

  const flatResponse = response.map((skill) => {
    return {
      id: skill.id,
      name: skill.Skill.name,
      skillId: skill.Skill.id,
      value: skill.level,
    };
  });

  return flatResponse;
}
