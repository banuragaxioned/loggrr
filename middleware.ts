import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import dz from "./server/db";
import { userWorkspace, workspace } from "./server/db/schema";
import { parse } from "./lib/middleware/utils";
import { excludedNavRoutes } from "./config/site";

export default withAuth(
  async function middleware(req) {
    const { key } = parse(req);
    const url = req.nextUrl.clone();

    // Get the user ID from the token
    const userId = req.nextauth?.token?.id as number;

    if (!userId) return;

    // Check if the user has access to the workspace
    const userWorkspaces = await dz
      .select({ id: userWorkspace.id, slug: workspace.slug })
      .from(userWorkspace)
      .where(eq(userWorkspace.userId, userId))
      .leftJoin(workspace, eq(userWorkspace.workspaceId, workspace.id));

    // Check if the workspace is not found in the user's workspaces
    const workspaceFound = userWorkspaces.find((w) => w.slug === key);
    const isExludedNav = excludedNavRoutes.includes(`/${key}`);

    // Redirect to the first workspace if the workspace is not found in the user's workspaces
    if (!workspaceFound && !isExludedNav) {
      const foundSlug = userWorkspaces?.[0]?.slug;

      if (foundSlug) {
        url.pathname = `/${foundSlug}`;
        return NextResponse.redirect(url);
      }

      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  },
  {
    callbacks: {
      authorized({ token }) {
        if (token) return true; // If there is a token, the user is authenticated

        return false;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/static|_next/image|thanks|favicon.ico|favicon.svg|^$).+)",
  ],
};
