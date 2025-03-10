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
  serverExternalPackages: ["@prisma/client"],
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
