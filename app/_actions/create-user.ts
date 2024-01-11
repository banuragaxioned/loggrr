"use server";

import { db } from "@/server/db";

const { PrismaAdapter } = require("@next-auth/prisma-adapter");

const adapter = PrismaAdapter(db);

export async function createUser(email: string) {
  await adapter.createUser({ email: email });
}
