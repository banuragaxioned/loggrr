import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import { betterFetch } from "@better-fetch/fetch";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle organization preferences for login path
  if (request.nextUrl.pathname.includes("/login")) {
    const preferenceCookie = request.cookies.get("user-preferences");
    if (preferenceCookie) {
      const preferences = JSON.parse(preferenceCookie.value);
      const { lastOrganizationSlug } = preferences as {
        lastOrganizationSlug?: string;
      };

      if (lastOrganizationSlug) {
        return NextResponse.redirect(new URL(`/${lastOrganizationSlug}`, request.url));
      }
    }
  }

  return NextResponse.next();
}

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
    "/((?!api/|_next/static|_next/image|login|thanks|favicon.ico|favicon.svg|^$).+)",
  ],
};
