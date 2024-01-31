export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /thanks (special page for redirecting after form submissions)
     * 7. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    {
      source: "/((?!api/|_next/|_proxy/|_static|_vercel|thanks|[\\w-]+\\.\\w+).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
