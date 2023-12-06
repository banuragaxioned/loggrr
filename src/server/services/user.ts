"use server";

const { PrismaAdapter } = require("@next-auth/prisma-adapter");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const adapter = PrismaAdapter(prisma);

export async function createUser(email: string) {
  await adapter.createUser({ email: email });
  console.log("User created successfully!");
}
