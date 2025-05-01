import { betterAuth } from "better-auth";
import { openAPI, oAuthProxy, magicLink, admin, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { sendMail } from "./email";
import { render } from "@react-email/render";
import MagicLinkEmail from "../emails/magic-link";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: [process.env.CORS_ORIGIN!],
  emailAndPassword: { enabled: false },
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.CORS_ORIGIN! + "/api/auth/callback/google",
      overrideUserInfoOnSignIn: true,
      mapProfileToUser: (profile) => {
        console.log(profile);
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  },
  plugins: [
    openAPI(),
    oAuthProxy(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const html = await render(MagicLinkEmail({ magicLink: url }));
        await sendMail({
          to: email,
          subject: "Magic Link",
          html,
        });
      },
    }),
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
      enabled: process.env.NODE_ENV === "production",
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
