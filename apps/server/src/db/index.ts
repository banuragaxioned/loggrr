import { drizzle } from "drizzle-orm/neon-serverless";

export interface Env {
  DATABASE_URL: string;
}

export const db = (env: Env) => drizzle(env.DATABASE_URL);
