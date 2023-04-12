import { milestoneRouter } from "./routers/milestone";
import { statsRouter } from "@/server/api/routers/stats";
import { projectRouter } from "@/server/api/routers/project";
import { createTRPCRouter } from "@/server/api/trpc";
import { teamRouter } from "@/server/api/routers/team";
import { skillsRouter } from "@/server/api/routers/skills";
import { reportRouter } from "@/server/api/routers/report";
import { clientRouter } from "@/server/api/routers/client";
import { taskRouter } from "@/server/api/routers/task";
import { timelogRouter } from "@/server/api/routers/timelog";
import { profileRouter } from "@/server/api/routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  tenant: teamRouter,
  project: projectRouter,
  client: clientRouter,
  skill: skillsRouter,
  report: reportRouter,
  stats: statsRouter,
  milestone: milestoneRouter,
  task: taskRouter,
  timelog: timelogRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
