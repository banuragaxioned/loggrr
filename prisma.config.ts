import "dotenv/config";

import path from "node:path";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  // Prisma 7 moved the connection URL out of the schema. It's used by the CLI
  // (generate/migrate/db push). Bun loads .env natively for the bunx scripts.
  datasource: {
    url: env("DATABASE_URL"),
  },
});
