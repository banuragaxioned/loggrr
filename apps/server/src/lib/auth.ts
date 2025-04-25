import { betterAuth } from "better-auth";
import { openAPI, admin, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { env } from "process";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CORS_ORIGIN!],
  emailAndPassword: { enabled: false },
  secret: env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    openAPI(),
    admin(),
    organization({
      teams: {
        enabled: true,
        maximumTeams: 10,
        allowRemovingAllTeams: false,
      },
    }),
  ],
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
