import { defineConfig } from "taze";

export default defineConfig({
  interactive: true,
  includeLocked: true,
  recursive: true,
  mode: "default",
  write: true,
  install: true,
  ignoreOtherWorkspaces: true,
  maturityPeriod: 2,
});
