import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, organization, openAPI, magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@workspace/db/client";
import { env } from "../env";
import { sendEmail } from "@workspace/email/lib/send";
import { MagicLinkEmail } from "@workspace/email/emails/magic-link";
import { OrganizationInviteEmail } from "@workspace/email/emails/organization-invite";

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
      async sendInvitationEmail(data) {
        const inviteLink = `/accept-invitation/${data.id}`;
        await sendEmail({
          to: data.email,
          subject: `Invitation to join ${data.organization.name} on Loggrr`,
          html: OrganizationInviteEmail({
            organizationName: data.organization.name,
            invitorName: data.inviter.user.name,
            inviteLink,
          }),
        });
      },
    }),
    openAPI(),
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: "Magic Link",
          html: MagicLinkEmail({ magicLink: url }),
        });
      },
    }),
  ],
  secret: env.AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(config);
export type Session = typeof auth.$Infer.Session;
