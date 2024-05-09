import { PrismaAdapter } from "@next-auth/prisma-adapter";
import getServerSession, { type NextAuthOptions, type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { render } from "@react-email/render";

// import EmailProvider from "next-auth/providers/email";
import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { Role } from "@prisma/client";

import WorkspaceJoinedEmail from "@/email/workspace-joined";
import RegisterEmail from "@/email/register";
import { siteConfig } from "@/config/site";
import { sendEmail } from "@/lib/email";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      workspaces: { id: number; name: string; slug: string; role: Role }[];
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: env.EMAIL_HOST,
    //     port: Number(env.EMAIL_PORT),
    //     auth: {
    //       user: env.EMAIL_USER,
    //       pass: env.EMAIL_PASSWORD,
    //     },
    //   },
    //   from: env.EMAIL_FROM,
    //   maxAge: 24 * 60 * 60,
    // }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser && user.email) {
        if (user.email.endsWith("@axioned.com")) {
          await db.userWorkspace.create({
            data: {
              workspaceId: 1,
              userId: +user.id,
              role: Role.USER,
            },
          });

          if (!user) return;

          const registerEmailHtml = render(
            RegisterEmail({
              siteUrl: `${siteConfig.url}`,
              siteName: siteConfig.name,
              name: user.name ?? "",
            }),
          );

          const registerEmailOptions = {
            to: user.email,
            subject: "Welcome to Loggrr",
            html: registerEmailHtml,
          };

          await sendEmail(registerEmailOptions);

          // TODO: Replace hardcode values with workspace data
          const workspaceEmailHtml = render(
            WorkspaceJoinedEmail({
              username: user.name ?? "Folk",
              inviteLink: `${siteConfig.url}/axioned`,
              teamName: "Axioned",
              siteName: siteConfig.name,
            }),
          );

          const workspaceEmailOptions = {
            to: user.email,
            subject: "You've joined Axioned workspace",
            html: workspaceEmailHtml,
          };

          await sendEmail(workspaceEmailOptions);
        }
      }
    },
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = Number(token.id);
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;

        const workspaces = await db.userWorkspace.findMany({
          where: {
            userId: Number(token.id),
          },
          select: {
            role: true,
            workspace: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        });

        session.user.workspaces = workspaces.map((list) => {
          return {
            id: list.workspace.id,
            name: list.workspace.name,
            slug: list.workspace.slug,
            role: list.role,
          };
        });
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      return token;
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
