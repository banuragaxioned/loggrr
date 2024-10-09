import { PrismaAdapter } from "@next-auth/prisma-adapter";
import getServerSession, { type NextAuthOptions, type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
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
  adapter: PrismaAdapter(db as any),
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
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_HOST,
        port: Number(env.EMAIL_PORT),
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      maxAge: 24 * 60 * 60,
    }),
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
      // If the user is new and has an email, check if they have a workspace
      if (isNewUser && user.email) {
        const userEmailDomain = user.email.split("@")[1];

        const workspace = await db.workspace.findUnique({
          where: {
            domain: userEmailDomain,
          },
        });

        // If the user has a workspace, add them to the workspace
        if (workspace) {
          await db.userWorkspace.create({
            data: {
              workspaceId: workspace.id,
              userId: Number(user.id),
            },
          });

          // If the user doesn't have a name, set it to the first part of the email
          if (!user.name) {
            await db.user.update({
              where: {
                id: Number(user.id),
              },
              data: {
                name: user.email.split("@")[0],
              },
            });
          }

          // Send the user a welcome email
          const registerEmailHtml = RegisterEmail({
            siteUrl: `${siteConfig.url}`,
            siteName: siteConfig.name,
            name: user.name ?? "",
          });

          const registerEmailOptions = {
            to: user.email,
            subject: `Welcome to ${siteConfig.name}`,
            html: registerEmailHtml,
          };

          await sendEmail(registerEmailOptions);

          // Notify the user that they have joined a workspace automatically
          const workspaceEmailHtml = WorkspaceJoinedEmail({
            username: user.name ?? "Folk",
            inviteLink: `${siteConfig.url}/${workspace.slug}`,
            teamName: workspace.name,
            siteName: siteConfig.name,
          });

          const workspaceEmailOptions = {
            to: user.email,
            subject: `You've joined ${workspace.name} workspace`,
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
        session.user.name = token.name ?? token.email?.split("@")[0];
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
          cacheStrategy: { ttl: 600 },
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
        token.name = user.name ?? user.email?.split("@")[0];
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
