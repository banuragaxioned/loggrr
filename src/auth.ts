import { PrismaAdapter } from "@next-auth/prisma-adapter";
import getServerSession, { type NextAuthOptions, type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { env } from "@/env.mjs";
import { db } from "@/db";
import { Role } from "@prisma/client";

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
      timezone: string;
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
      if (isNewUser && user.email) {
        // if email ends with @axioned.com then add them to workspace and role
        // FIX: Hardcoded
        // Maybe domain whitelist in database? Probably needs to be "verified" domains only though.
        if (user.email.endsWith("@axioned.com")) {
          await db.workspace.update({
            where: { slug: "axioned" },
            data: {
              Users: {
                connect: {
                  id: Number(user.id),
                },
              },
            },
          });
        }

        if (user.email.endsWith("@axioned.com")) {
          await db.userRole.create({
            data: {
              workspaceId: 1,
              userId: Number(user.id),
              role: Role.USER,
            },
          });
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

        const teams = await db.user.findUniqueOrThrow({
          where: { id: session.user.id },
          select: {
            id: true,
            name: true,
            timezone: true,
            Workspace: {
              select: {
                id: true,
                slug: true,
                name: true,
                UserRole: { select: { role: true } },
              },
            },
          },
        });

        session.user.workspaces = teams.Workspace.map((workspace) => {
          return {
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            //NOTE: Each user can only have one `role` per workspace. Even though we have many to many relation
            role: workspace.UserRole.map((userRole) => userRole.role)[0],
          };
        });

        session.user.timezone = teams.timezone;
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
