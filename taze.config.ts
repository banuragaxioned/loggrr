import { defineConfig } from "taze";

export default defineConfig({
  // Safe by default: `bun run taze` only lists available updates.
  // Use `bun run taze:fix` to interactively write + install.
  includeLocked: true,
  recursive: true,
  mode: "default",
  ignoreOtherWorkspaces: true,
  maturityPeriod: 2,
});
