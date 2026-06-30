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
    "eslint", // v9 → v10 (major, peer dep constraints)
    "react-day-picker", // major version bump
  ],
});
