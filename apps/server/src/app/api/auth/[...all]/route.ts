import { auth } from "@/lib/auth";

export interface Env {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  CORS_ORIGIN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const authInstance = auth(env);
    return authInstance.handler(request);
  },
};
