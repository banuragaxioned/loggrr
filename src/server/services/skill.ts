import { Tenant, User } from "@prisma/client";
import { prisma } from "../db";
import { db } from "@/lib/db";

export async function getSkills(team: Tenant["slug"]) {
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

  const users = await db.skillScore.findMany({
    where: { Tenant: { slug: team } },
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

export async function getUserSkills(userId: User["id"], team: Tenant["slug"]) {
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
