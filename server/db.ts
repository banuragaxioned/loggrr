import { env } from "@/env.mjs";
// prisma imports
import { PrismaClient } from "@prisma/client";

// drizzle imports
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";

// prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// drizzle
export const client = postgres(env.DATABASE_URL, { max: 10, onnotice: () => {} });

export const dz = drizzle(client, { schema, logger: true });

export type Dz = typeof drizzle;

export default dz;
