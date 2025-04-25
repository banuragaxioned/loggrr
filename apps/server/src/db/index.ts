import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export interface Env {
  DATABASE_URL: string;
}

export const db = (env: Env) => drizzle(env.DATABASE_URL, { schema });
