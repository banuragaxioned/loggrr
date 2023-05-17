import { z } from "zod";
import dayjs from "dayjs";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Allocation, AllocationFrequency } from "@prisma/client";
import { AllocationDates, GlobalAllocation, ProjectAllocation } from "@/types"
import { splitIntoChunk } from "@/lib/helper";

export const allocationRouter = createTRPCRouter({
  // Create a new time Allocation
  createAllocation: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        projectId: z.number(),
        userId: z.number(),
        date: z.date(),
        frequency: z.nativeEnum(AllocationFrequency),
        enddate: z.date().optional(),
        billableTime: z.number(),
        nonBillableTime: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug;
      const client = await ctx.prisma.allocation.create({
        data: {
          date: input.date,
          enddate: input.enddate,
          billableTime: input.billableTime,
          frequency: input.frequency,
          nonBillableTime: input.nonBillableTime,
          Tenant: {
            connect: { slug },
          },
          Project: {
            connect: { id: input.projectId },
          },
          User: {
            connect: { id: input.userId },
          },
        },
      });
      return client;
    }),

  // get project allocations
  getAllocations: protectedProcedure
    .input(
      z.object({
        team: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        page: z.number(),
        pageSize: z.number(),
        projectId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.startDate > input.endDate) {
        throw new Error("Start date must be before end date");
      }

      const isProjectExist = input.projectId && await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (input.projectId && !isProjectExist) {
        throw new Error('Project not found');
      }

      // filter out users based on projectId
      const projectFilter = {
        Project: {
          some: { id: input.projectId }
        },
      };

      // get all user ids for cursor
      const allUserIds = await ctx.prisma.user.findMany({
        where: {
          TenantId: { some: { slug: input.team } },
          ...((input.projectId) ? projectFilter : {}), /* get users based on project, if projectId exist */
        },
        orderBy: { name: 'asc' },
        select: {
          id: true,
        },
      });

      // user ids split into smaller chunks
      const allUserIdChunk = splitIntoChunk(allUserIds, input.pageSize);

      // page has been adjusted according to the array index
      const chunkIndex = input.page - 1;
      const cursorId = allUserIdChunk.length && allUserIdChunk[chunkIndex][0].id; /* first user id */

      const allocationQuery = {
        where: {
          OR: [
            {
              date: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            {
              enddate: {
                gte: input.startDate,
                lte: input.endDate,
              },
            },
            {
              AND: [
                {
                  date: {
                    lte: input.startDate,
                  }
                },
                {
                  enddate: {
                    gte: input.endDate,
                  }
                }
              ],
            },
          ],
        },
      };

      let finalData: ProjectAllocation[] | GlobalAllocation[];

      // project allocations
      if (input.projectId) {

        const projects = await ctx.prisma.project.findMany({
          where: {
            id: input.projectId,
            Tenant: { slug: input.team },
          },
          include: {
            Members: {
              orderBy: { name: 'asc' },
              take: input.pageSize,
              cursor: { id: cursorId },
              include: {
                Allocation: allocationQuery,
              }
            },
            Client: {
              select: {
                id: true,
                name: true,
              }
            }
          },
        });

        finalData = projects.map(project => {
          return {
            globalView: false,
            clientName: project.Client.name,
            projectId: project.id,
            projectName: project.name,
            users: project.Members.map(user => {

              // user allocatons dates
              const allocations = createAllocationDates(user.Allocation, input.endDate);

              // calculate user allocation time
              const totalTime = calculateAllocationTotalTime(allocations);

              // calculate average time
              const averageTime = parseFloat((totalTime / Object.keys(allocations).length).toFixed(2)) || 0;

              return {
                userId: user.id,
                userName: user.name,
                userAvatar: user.image || `${process.env.BASE_URL}/avatar.png`,
                averageTime: averageTime,
                totalTime: totalTime,
                allocations: allocations,
              };
            }),
          };
        });

      } else { // all projects allocations

        const users = await ctx.prisma.user.findMany({
          orderBy: { name: 'asc' },
          take: input.pageSize,
          cursor: { id: cursorId },
          where: {
            TenantId: {
              some: { slug: input.team }
            }
          },
          include: {
            Project: {
              include: {
                Allocation: allocationQuery,
                Client: true,
              }
            },
          },
        });

        finalData = users.map(user => {

          let grandTotalHours = 0;
          const cumulativeProjectDates: AllocationDates = {};

          const projectsData = user.Project.map(project => {

            const userAllocation = project.Allocation.filter(allocation => allocation.userId === user.id)

            // project allocatons dates
            const allocations = createAllocationDates(userAllocation, input.endDate);


            // calculate projects totalTime from allocations data
            const projectTotalTime = calculateAllocationTotalTime(allocations);

            // create and add hours in cumulativeProjectDates allocations
            for (const [allocationKey, allocation] of Object.entries(allocations)) {

              const isAllocationDateExist = cumulativeProjectDates[allocationKey];

              // create allocation, if allocation date not exist
              if (!isAllocationDateExist) {
                cumulativeProjectDates[allocationKey] = { ...allocation };
                grandTotalHours += allocation.totalTime; /* calculate all totalTime */

                // stop further execution
                continue;
              }

              // if allocation date exist add hours
              cumulativeProjectDates[allocationKey].billableTime += allocation.billableTime;
              cumulativeProjectDates[allocationKey].nonBillableTime += allocation.nonBillableTime;
              cumulativeProjectDates[allocationKey].totalTime += allocation.totalTime;

              grandTotalHours += allocation.totalTime; /* calculate all totalTime */
            };

            return {
              clientName: project.Client.name,
              projectId: project.id,
              projectName: project.name,
              totalTime: projectTotalTime,
              allocations: allocations,
            };
          });

          // calculate average hours
          const averageHours = parseFloat((grandTotalHours / Object.keys(cumulativeProjectDates).length).toFixed(2)) || 0;

          return {
            globalView: true,
            userId: user.id,
            userName: user.name,
            userAvatar: user.image || `${process.env.NEXTAUTH_URL}/avatar.png`,
            totalTime: grandTotalHours,
            averageTime: averageHours,
            cumulativeProjectDates: cumulativeProjectDates,
            projects: projectsData,
          };
        });
      }

      return finalData;
    }),
});

function calculateAllocationTotalTime(allocations: AllocationDates) {

  return Object.keys(allocations).reduce((accumulator, allocationKey) => {
    return accumulator + allocations[allocationKey].totalTime;
  }, 0);
}

// create allocation object for each date
function createAllocationDates(allocationData: Allocation[], endDate: Date) {
  return allocationData.reduce((accumulator, allocation) => {

    let allocationStartDate = allocation.date;
    const allocationEndDate = allocation.enddate;

    const billableTime = allocation.billableTime || 0;
    const nonBillableTime = allocation.nonBillableTime || 0;

    // allocationEndDate is not exist
    if (!allocationEndDate) {

      // change date string format to YYYY-MM-DD
      const date = allocationStartDate.toISOString().split('T')[0];
      const isAllocationDateExist = accumulator[date];

      // stop further execution, if allocation date is exist or
      // exist allocation updateAt date is latest date as compare to new allocation date
      const existAllocationUpdateAtIsGreaterThanNewAllocationUpdateAt = isAllocationDateExist && isAllocationDateExist.updatedAt > allocation.updatedAt;
      if (isAllocationDateExist || existAllocationUpdateAtIsGreaterThanNewAllocationUpdateAt) {
        return accumulator;
      }

      accumulator[date] = {
        id: allocation.id,
        billableTime: billableTime,
        nonBillableTime: nonBillableTime,
        totalTime: billableTime + nonBillableTime,
        updatedAt: allocation.updatedAt,
      };

      return accumulator;
    }

    // iterate if allocationStartDate is less than or equal to endDate and allocationDate
    while (allocationStartDate <= endDate && allocationStartDate <= allocationEndDate) {

      // change date string format to YYYY-MM-DD
      const date = allocationStartDate.toISOString().split('T')[0];

      accumulator[date] = {
        id: allocation.id,
        billableTime: billableTime,
        nonBillableTime: nonBillableTime,
        totalTime: billableTime + nonBillableTime,
        updatedAt: allocation.updatedAt,
      };

      // increase one day
      allocationStartDate = dayjs(allocationStartDate).add(1, 'day').toDate();

    }

    return accumulator;
  }, {} as AllocationDates);
}

