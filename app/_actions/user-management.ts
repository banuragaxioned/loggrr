"use server";

import { db } from "@/server/db";
import { z } from "zod";
const { PrismaAdapter } = require("@next-auth/prisma-adapter");

const adapter = PrismaAdapter(db);
const emailSchema = z.string().email();

export async function createUser(email: string) {
  emailSchema.parse(email);

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (user) return user;

  return await adapter.createUser({ email: email, name: email.split("@")[0] });
}

export async function findDomain(email: string) {
  emailSchema.parse(email);
  const result = await db.workspace.findUnique({
    where: {
      domain: email.split("@")[1],
      domainVerified: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      domain: true,
    },
  });

  return result;
}

export async function userExists(email: string) {
  emailSchema.parse(email);
  try {
    await db.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });
  } catch (e) {
    throw new Error("User does not have an account");
  }
  return { success: true };
}

export async function findUserById(id: number) {
  const result = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      timezone: true,
      workspaces: {
        select: {
          role: true,
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return result;
}
