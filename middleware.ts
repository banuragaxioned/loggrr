import { withAuth } from "next-auth/middleware";
import { parse } from "./lib/middleware/utils";

export default withAuth(
  function middleware(req) {
    const { key } = parse(req);
    console.log("Key:", key);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Auth callback triggered, token present:", !!token);
        return !!token;
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
     * 3. /_proxy/ (proxies for third-party services)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/static|_next/image|thanks|favicon.ico|favicon.svg|^$).+)",
  ],
};
