import { session } from "./../../db/src/schemas/auth-schema";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, organization, openAPI } from "better-auth/plugins";
import { db } from "@workspace/db/client";

export const config = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [admin(), organization(), openAPI({})],
  secret: process.env.BETTER_AUTH_SECRET!,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // Cache duration in seconds
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(config);
export type Session = typeof auth.$Infer.Session;
