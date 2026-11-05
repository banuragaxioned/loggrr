import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

const config = defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});

// Turbopack's current Wasm loader traces too broadly with Prisma's Worker
// runtime. Webpack keeps the deployment within Workers' bundle size limit.
config.buildCommand = "LOGGRR_BUILD_TARGET=cloudflare bunx next build --webpack";

export default config;
