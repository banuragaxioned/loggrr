import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, organization, openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@workspace/db/client";
import { env } from "../env";

export const config = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    admin(),
    organization({
      teams: {
        enabled: true,
      },
    }),
    openAPI(),
    nextCookies(),
  ],
  secret: env.AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // Cache duration in seconds
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(config);
export type Session = typeof auth.$Infer.Session;
