import { z } from "zod";
import dayjs from "dayjs";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Allocation, AllocationFrequency } from "@prisma/client";
import { AllocationDates } from "@/types"
import { splitIntoChunk } from "@/utils/utils";

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

      const isProjectExist = await ctx.prisma.project.findUnique({ 
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
      const cursorId = allUserIdChunk[chunkIndex][0].id; /* first user id */

      
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

      let finalData;

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
            clientName: project.Client.name,
            projectId: project.id,
            projectName: project.name,
            users: project.Members.map(user => {

              // user allocatons dates
              const allocations = createAllocationDates(user.Allocation, input.endDate);

              // calculate user allocation time
              const totalTime = calculateAllocationTotalTime(allocations);
      
              // calculate average time
              const averageHours = parseFloat((totalTime / Object.keys(allocations).length).toFixed(2)) || 0;
      
              return {
                userId: user.id,
                username: user.name,
                userAvatar: user.image,
                averageHours: averageHours,
                totalAllocationsHours: totalTime,
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
              }
            },
          },
        });
  
        finalData = users.map(user => {

          let grandTotalHours = 0;
          const topRowDates: AllocationDates = {};
      
          const projectsData = user.Project.map(project => {
      
            // project allocatons dates
            const allocations = createAllocationDates(project.Allocation, input.endDate);
      
            // calculate projects totalTime from allocations data
            const projectTotalTime = calculateAllocationTotalTime(allocations);
      
            // create and add hours in topRowDates allocations
            for (const [allocationKey, allocation] of Object.entries(allocations)) {
      
              const isAllocationDateExist = topRowDates[allocationKey];
      
              // create allocation, if allocation date not exist
              if (!isAllocationDateExist) {
                topRowDates[allocationKey] = { ...allocation };
                grandTotalHours += allocation.totalTime; /* calculate all totalTime */
      
                // stop further execution
                continue;
              }
      
              // if allocation date exist add hours 
              topRowDates[allocationKey].billableTime += allocation.billableTime;
              topRowDates[allocationKey].nonBillableTime += allocation.nonBillableTime;
              topRowDates[allocationKey].totalTime += allocation.totalTime;
      
              grandTotalHours += allocation.totalTime; /* calculate all totalTime */
            };
      
            return {
              projectId: project.id,
              projectName: project.name,
              totalTime: projectTotalTime,
              allocationDates: allocations,
            };
          });
      
          // calculate average hours
          const averageHours = parseFloat((grandTotalHours / Object.keys(topRowDates).length).toFixed(2)) || 0;
      
          return {
            userId: user.id,
            username: user.name,
            userAvatar: user.image,
            totalTime: grandTotalHours,
            averageHours: averageHours,
            topRowDates: topRowDates,
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

