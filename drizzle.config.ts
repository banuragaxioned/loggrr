import { defineConfig } from "drizzle-kit";
import { env } from "@/env.mjs";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./drizzle/schema.ts",
  dbCredentials: { url: env.DATABASE_URL },
  verbose: true,
  strict: true,
});
