import type { Workspace, User } from "@prisma/client";
import { db } from "@/server/db";

export async function getSkills(team: Workspace["slug"]) {
  const response = await db.skill.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      workspace: {
        slug: team,
      },
    },
  });

  const users = await db.skillScore.findMany({
    where: { workspace: { slug: team } },
    select: {
      skillId: true,
      user: {
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
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
      level: true,
    },
    where: {
      workspace: {
        slug: team,
      },
      user: {
        id: userId,
      },
    },
  });

  const flatResponse = response.map((skill) => {
    return {
      id: skill.id,
      name: skill.skill.name,
      skillId: skill.skill.id,
      value: skill.level,
    };
  });

  return flatResponse;
}
