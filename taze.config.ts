import { defineConfig } from "taze";

export default defineConfig({
  // Safe by default: `bun run taze` only lists available updates.
  // Use `bun run taze:fix` to interactively write + install.
  includeLocked: true,
  recursive: true,
  mode: "default",
  ignoreOtherWorkspaces: true,
  maturityPeriod: 2,
  exclude: [
    // Major version bumps requiring manual migration
    "@types/node",               // v25 → v26 (major)
    "eslint",                    // v9 → v10 (major, peer dep constraints)
    "eslint-plugin-tailwindcss", // v3 → v4 (major)
    "prisma",                    // major migration required
    "@prisma/client",            // keep in sync with prisma
    "react-day-picker",          // major version bump
  ],
});
