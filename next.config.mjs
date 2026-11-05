import { resolve } from "node:path";
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
  webpack(config) {
    if (process.env.LOGGRR_BUILD_TARGET === "cloudflare") {
      // Leave precompiled Wasm imports for Wrangler, as required by Workers.
      config.externals.push(
        /**
         * @param {{ context?: string, request?: string }} data
         * @param {(error?: Error | null, result?: string) => void} callback
         */
        ({ context, request }, callback) => {
          if (request?.endsWith(".wasm?module")) {
            return callback(null, `module ${resolve(context ?? process.cwd(), request)}`);
          }
          callback();
        },
      );
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
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

// Keep the existing Turbopack development and Node/Vercel build path.
if (process.env.LOGGRR_BUILD_TARGET !== "cloudflare") delete config.webpack;

export default config;

initOpenNextCloudflareForDev();
