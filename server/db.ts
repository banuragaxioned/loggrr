import { env } from "@/env.mjs";

// Prisma imports
import { PrismaClient } from "@prisma/client";

// Drizzle imports
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

// Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Drizzle
export const client = postgres(env.DATABASE_URL);
export const dz = drizzle(client, { schema });
export type Dz = typeof drizzle;
export default dz;
