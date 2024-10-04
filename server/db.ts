import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";
import { env } from "@/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }).$extends(
    withOptimize({ apiKey: env.OPTIMIZE_API_KEY }),
  ) as PrismaClient;
  
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
