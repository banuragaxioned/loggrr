import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import { env } from "process";

export const db = drizzle(env.DATABASE_URL!, { schema });
