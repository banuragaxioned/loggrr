import { withAuth } from "next-auth/middleware";
import { parse } from "./lib/middleware/utils";

export default withAuth(
  function middleware(req) {
    const { key } = parse(req);
  },
  {
    callbacks: {
      authorized({ token }) {
        if (token) return true; // If there is a token, the user is authenticated
        return false;
      },
    },
    pages: {
      signIn: "/auth/signin",
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
     * 5. /auth/ routes (authentication pages)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/static|_next/image|auth/|thanks|favicon.ico|favicon.svg|^$).+)",
  ],
};
