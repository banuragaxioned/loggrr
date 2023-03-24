import { projectRouter } from "./routers/project";
import { createTRPCRouter } from "./trpc";
import { tenantRouter } from "./routers/tenant";
import { skillsRouter } from "./routers/skills";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  tenant: tenantRouter,
  project: projectRouter,
  skill: skillsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
