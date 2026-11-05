import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // Prisma CLI and local database tooling are build dependencies, not app runtime.
  outputFileTracingExcludes: {
    "/*": ["node_modules/**/prisma/build/**", "node_modules/**/@prisma/dev/**", "node_modules/**/@electric-sql/**"],
  },
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  async redirects() {
    return [
      {
        source: "/:team/skills",
        destination: "/:team/skills/summary",
        permanent: true,
      },
      {
        source: "/:team/reports",
        destination: "/:team/reports/summary",
        permanent: true,
      },
    ];
  },
};

export default config;

initOpenNextCloudflareForDev();
