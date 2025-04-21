import { betterAuth } from "better-auth";
import { openAPI, admin, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";

export interface Env {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  CORS_ORIGIN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const auth = (env: Env) =>
  betterAuth({
    database: drizzleAdapter(db(env), {
      provider: "pg",
      schema: schema,
    }),
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.CORS_ORIGIN, "https://loggrr.com", "https://v1.loggrr.com"],
    emailAndPassword: { enabled: false },
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    plugins: [openAPI(), admin(), organization()],
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain: ".loggrr.com",
      },
      defaultCookieAttributes: {
        secure: true,
        httpOnly: true,
        sameSite: "none", // Allows CORS-based cookie sharing across subdomains
        partitioned: true, // New browser standards will mandate this for foreign cookies
      },
    },
  });
