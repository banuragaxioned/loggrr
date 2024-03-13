import { PrismaClient } from "@prisma/client";
import { env } from "@/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma.$extends({
  name: "workspaceExtension",
  client: {
    // ... your client methods
  },
  query: {
    skill: {
      async findMany({ args, query }) {
        args.where = {
          ...args.where,
          workspace: {
            slug: "axioned",
          },
        };
        return query(args);
      },
    },
    project: {
      async findMany({ args, query }) {
        args.where = {
          ...args.where,
          workspace: {
            slug: "axioned",
          },
        };
        return query(args);
      },
    },
  },
  // query: {
  //   $allModels: {
  //     async findMany({ model, operation, args, query }) {
  //       const excluded = ["Workspace", "Session", "VerificationToken", "Account", "User"];
  //       if (excluded.includes(model)) {
  //         return query(args);
  //       }

  //       args.where = {
  //         ...args.where,
  //         workspace: {
  //           slug: "axioned",
  //         },
  //       };

  //       return query(args);
  //     },
  //   },
  // },
  // ... your methods
});
