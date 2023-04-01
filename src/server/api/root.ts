import { milestoneRouter } from './routers/milestone';
import { statsRouter } from "@/server/api/routers/stats";
import { projectRouter } from "@/server/api/routers/project";
import { createTRPCRouter } from "@/server/api/trpc";
import { tenantRouter } from "@/server/api/routers/tenant";
import { skillsRouter } from "@/server/api/routers/skills";
import { reportRouter } from "@/server/api/routers/report";
import { clientRouter } from "@/server/api/routers/client";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  tenant: tenantRouter,
  project: projectRouter,
  client: clientRouter,
  skill: skillsRouter,
  report: reportRouter,
  stats: statsRouter,
  milestone: milestoneRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
