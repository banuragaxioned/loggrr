import { prisma } from "../db";
import { db } from "@/lib/db";
import dayjs from "dayjs";
import { getAllocation } from "@/types";
import { splitIntoChunk } from "@/lib/helper";
import { Allocation } from "@prisma/client";
import { AllocationDates, GlobalAllocation, ProjectAllocation } from "@/types";

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
      const date = allocationStartDate.toISOString().split("T")[0];
      const isAllocationDateExist = accumulator[date];

      // stop further execution, if allocation date is exist or
      // exist allocation updateAt date is latest date as compare to new allocation date
      const existAllocationUpdateAtIsGreaterThanNewAllocationUpdateAt =
        isAllocationDateExist && isAllocationDateExist.updatedAt > allocation.updatedAt;
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
      const date = allocationStartDate.toISOString().split("T")[0];

      accumulator[date] = {
        id: allocation.id,
        billableTime: billableTime,
        nonBillableTime: nonBillableTime,
        totalTime: billableTime + nonBillableTime,
        updatedAt: allocation.updatedAt,
      };

      // increase one day
      allocationStartDate = dayjs(allocationStartDate).add(1, "day").toDate();
    }

    return accumulator;
  }, {} as AllocationDates);
}

export async function getAllocations(input: getAllocation) {

  const isProjectExist = input.projectId && (await prisma.project.findUnique({
      where: { id: input.projectId },
    }));

  if (input.projectId && !isProjectExist) {
    throw new Error("Project not found");
  }
  const projectFilter = {
    Project: {
      some: { id: input.projectId },
    },
  };

  const allUserIds = await prisma.user.findMany({
    where: { TenantId: { some: { slug: input.team } }, ...(input.projectId ? projectFilter : {}) },
    orderBy: { name: "asc" },
    select: {
      id: true,
    },
  });

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
              },
            },
            {
              enddate: {
                gte: input.endDate,
              },
            },
          ],
        },
      ],
    },
  };

  let finalData: ProjectAllocation[] | GlobalAllocation[];

  if (input.projectId) {
    const projects = await db.project.findMany({
      where: {
        id: input.projectId,
        Tenant: { slug: input.team },
      },
      include: {
        Members: {
          orderBy: { name: "asc" },
          take: input.pageSize,
          cursor: { id: cursorId },
          include: {
            Allocation: allocationQuery,
          },
        },
        Client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    finalData = projects.map((project) => {
      return {
        globalView: false,
        clientName: project.Client.name,
        projectId: project.id,
        projectName: project.name,
        users: project.Members.map((user) => {
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
  } else {
    // all projects allocations

    const users = await db.user.findMany({
      orderBy: { name: "asc" },
      take: input.pageSize,
      cursor: { id: cursorId },
      where: {
        TenantId: {
          some: { slug: input.team },
        },
      },
      include: {
        Project: {
          include: {
            Allocation: allocationQuery,
            Client: true,
          },
        },
      },
    });

    finalData = users.map((user) => {
      let grandTotalHours = 0;
      const cumulativeProjectDates: AllocationDates = {};

      const projectsData = user.Project.map((project) => {
        const userAllocation = project.Allocation.filter((allocation) => allocation.userId === user.id);

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
        }

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
}

export async function getProjectsId(slug: string) {
  const projects = await db.project.findMany({
    where: { Tenant: { slug } },
    select: {
      id: true,
      name: true,
      Members: { select: { id: true, name: true } },
    },
  });

  return projects;
}

export const getAllUsers = async (slug: string) => {
  const users = await prisma.user.findMany({
    where: { TenantId: { some: { slug } } },
    select: {
      id: true,
      name: true,
    },
  });
  return users;
};