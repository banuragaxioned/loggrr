import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { AllocationFrequency } from "@prisma/client";
import { AllocationDates } from "@/types"
import dayjs from "dayjs";

export const allocationRouter = createTRPCRouter({
  // Create a new time Allocaiton
  createAllocation: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        projectId: z.number(),
        userId: z.number(),
        date: z.date(),
        frequency: z.nativeEnum(AllocationFrequency),
        endDate: z.date().optional(),
        billableTime: z.number(),
        nonBillableTime: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug;
      const client = await ctx.prisma.allocation.create({
        data: {
          date: input.date,
          endDate: input.endDate,
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
  
  // get all project allocations
  getAllocations: protectedProcedure
    .input(
      z.object({
        team: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        page: z.number(),
        pageSize: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.startDate > input.endDate) {
        throw new Error("Start date must be before end date");
      }

      const users = await ctx.prisma.user.findMany({
        orderBy: { name: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        include: {
          Project: {
            include: {
              Allocation: {
                where: {
                  OR: [
                    {
                      date: {
                        gte: input.startDate,
                        lte: input.endDate,
                      },
                    },
                    {
                      endDate: {
                        gte: input.startDate,
                        lte: input.endDate,
                      }
                    },
                    {
                      AND: [
                        {
                          date: {
                            lte: input.startDate,
                          }
                        },
                        {
                          endDate: {
                            gte: input.endDate,
                          }
                        }
                      ]
                    },
                  ],
                },
              },
            }
          },
        },
      });

      const finalData = users.map(user => {

        let grandTotalHours = 0;
        const topRowDates: AllocationDates = {};
  
        const projectsData = user.Project.map(project => {
  
          // project allocatons dates
          const allocations = project.Allocation.reduce((accumulator, allocation) => {
  
            let allocationStartDate = allocation.date;
            const allocationEndDate = allocation.endDate;
            
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
                totalHours: billableTime + nonBillableTime,
                updatedAt: allocation.updatedAt,
              };
  
              return accumulator;
            }
  
            // iterate if allocationStartDate is less than or equal to endDate and allocationDate 
            while (allocationStartDate <= input.endDate && allocationStartDate <= allocationEndDate) {
  
              // change date string format to YYYY-MM-DD
              const date = allocationStartDate.toISOString().split('T')[0]; 
              
              accumulator[date] = {
                id: allocation.id,
                billableTime: billableTime,
                nonBillableTime: nonBillableTime,
                totalHours: billableTime + nonBillableTime,
                updatedAt: allocation.updatedAt,
              };
  
              // increase one day 
              allocationStartDate = dayjs(allocationStartDate).add(1, 'day').toDate();
  
            }
  
            return accumulator;
          }, {} as AllocationDates);
  
          // calculate projects totalHours from final allocations data
          const projectTotalHours = Object.keys(allocations).reduce((accumulator, allocationKey) => {
            return accumulator + allocations[allocationKey].totalHours;
          }, 0);
  
          // create and add hours in topRowDates allocations
          for (const [allocationKey, allocation] of Object.entries(allocations)) {
  
            const isAllocationDateExist = topRowDates[allocationKey];
  
            // create allocation, if allocation date not exist
            if (!isAllocationDateExist) {
              topRowDates[allocationKey] = { ...allocation };
              grandTotalHours += allocation.totalHours; /* calculate all totalHours */
              
              // stop further execution
              continue;
            }
            
            // if allocation date exist add hours 
            topRowDates[allocationKey].billableTime += allocation.billableTime;
            topRowDates[allocationKey].nonBillableTime += allocation.nonBillableTime;
            topRowDates[allocationKey].totalHours += allocation.totalHours;
            
            grandTotalHours += allocation.totalHours; /* calculate all totalHours */
          };
          
          return {
            projectId: project.id,
            projectName: project.name,
            totalHours: projectTotalHours,
            allocationDates: allocations,
          };
        });
  
        // calculate average hours
        const averageHours = grandTotalHours / Object.keys(topRowDates).length; 
        
        return {
          userId: user.id,
          username: user.name,
          // userAvatar: user.avatar,
          totalHours: grandTotalHours,
          averageHours: averageHours,
          topRowDates: topRowDates,
          projects: projectsData,
        };
      });
      
      return finalData;
    }),
  
  // get project allocations
  getProjectAllocations: protectedProcedure
    .input(
      z.object({
        team: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        page: z.number(),
        pageSize: z.number(),
        projectId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.startDate > input.endDate) {
        throw new Error("Start date must be before end date");
      }

      const projects = await ctx.prisma.project.findMany({
        where: {
          id: input.projectId,
          Tenant: { slug: input.team },
        },
        include: {
          Members: {
            skip: (input.page - 1) * input.pageSize,
            take: input.pageSize,
            include: {
              Allocation: {
                where: {
                  OR: [
                    {
                      date: {
                        gte: input.startDate,
                        lte: input.endDate,
                      },
                    },
                    {
                      endDate: {
                        gte: input.startDate,
                        lte: input.endDate,
                      }
                    },
                    {
                      AND: [
                        {
                          date: {
                            lte: input.startDate,
                          }
                        },
                        {
                          endDate: {
                            gte: input.endDate,
                          }
                        }
                      ]
                    },
                  ],
                },
              },
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

      const finalData = projects.map(project => {
        return {
          clientName: project.Client.name,
          projectId: project.id,
          projectName: project.name,
          users: project.Members.map(user => {
            // allocatons dates
            const allocations = user.Allocation.reduce((accumulator, allocation) => {
    
              let allocationStartDate = allocation.date;
              const allocationEndDate = allocation.endDate;
              
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
                  totalHours: billableTime + nonBillableTime,
                  updatedAt: allocation.updatedAt,
                };
    
                return accumulator;
              }
    
              // iterate if allocationStartDate is less than or equal to endDate and allocationDate 
              while (allocationStartDate <= input.endDate && allocationStartDate <= allocationEndDate) {
    
                // change date string format to YYYY-MM-DD
                const date = allocationStartDate.toISOString().split('T')[0]; 
                
                accumulator[date] = {
                  id: allocation.id,
                  billableTime: billableTime,
                  nonBillableTime: nonBillableTime,
                  totalHours: billableTime + nonBillableTime,
                  updatedAt: allocation.updatedAt,
                };
    
                // increase one day 
                allocationStartDate = dayjs(allocationStartDate).add(1, 'day').toDate();
    
              }
    
              return accumulator;
            }, {} as AllocationDates);
            
            // calculate allocations totalHours
            const totalHours = Object.keys(allocations).reduce((accumulator, allocationKey) => {
              return accumulator + allocations[allocationKey].totalHours;
            }, 0);

            // calculate average hours
            const averageHours = totalHours / Object.keys(allocations).length; 
            
            return {
              userId: user.id,
              username: user.name,
              averageHours: averageHours,
              totalAllocationsHours: totalHours,
              allocations: allocations,
            };
          }),
        };
      });
      
      return finalData;
    }),
});
