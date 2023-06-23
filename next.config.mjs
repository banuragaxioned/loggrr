// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzerConfig = {
  enabled: process.env.ANALYZE === "true",
};

const withBundleAnalyzerPlugin = withBundleAnalyzer(bundleAnalyzerConfig);

/** @type {import("next").NextConfig} */
const config = withBundleAnalyzerPlugin({
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com","localhost"],
  },
});

export default config;
