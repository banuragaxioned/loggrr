import { prisma } from "../db";
import { db } from "@/lib/db";
import { AllocationFrequency } from "@prisma/client";
import { AllocationDates } from "@/types";
import dayjs from "dayjs";

interface AllocationDate {
  id: number;
  billableTime: number;
  nonBillableTime: number;
  updatedAt: Date;
  frequency: AllocationFrequency;
  date: Date;
  enddate: Date | any;
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
      Allocation: { select: { id: true, projectId: true } },
    },
  });
  return users;
};

const calculateAllocationTotalTime = (allocations: AllocationDates) => {
  return Object.keys(allocations).reduce((accumulator, allocationKey) => {
    return accumulator + allocations[allocationKey].totalTime;
  }, 0);
};

const getFormatedData = (timeArr: any) => {
  const resultObj: any = {};
  for (let x in timeArr) {
    const date = x.split(",")[0];
    resultObj[date] = timeArr[x];
  }
  return resultObj;
};

const getSubRows = (user: any, startDate: Date, endDate: Date) => {
  const subRows = user?.projects?.map((project: any, i: number) => ({
    id: project?.projectId,
    userId: user.userId,
    name: project?.projectName.slice(0, 5) + "...",
    title: project?.projectName,
    clientName: project?.clientName,
    totalTime: project?.totalTime,
    userName: user.userName,
    billable: project?.billable,
    frequency: project?.frequency,
    timeAssigned: fillEmptyAllocations(getFormatedData(project?.allocations), startDate, endDate),
    team: user.team,
  }));
  return subRows;
};

const fillEmptyAllocations = (temp: any, startDate: Date, endDate: Date) => {
  const finalData = { ...temp };
  let date: any = startDate;
  while (date < endDate) {
    const key = date.toISOString().split("T")[0];
    if (!finalData[key])
      finalData[key] = {
        billableTime: 0,
        nonBillableTime: 0,
        totalTime: 0,
      };
    date = dayjs(date).add(1, "day").toDate();
  }
  return finalData;
};

const getTotalAssignedTime = (allProjects: any, startDate: Date, endDate: Date) => {
  const temp: any = {};
  allProjects.map((project: { allocations: any }) => {
    const keys = Object.keys(project.allocations);
    keys.length &&
      keys.map((key: string) => {
        const { billableTime, totalTime, nonBillableTime } = project.allocations[key];
        temp[key]
          ? (temp[key] = {
              billableTime: temp[key] ? temp[key].billableTime + billableTime : billableTime,
              nonBillableTime: temp[key].nonBillableTime + nonBillableTime,
              totalTime: temp[key].totalTime + totalTime,
            })
          : (temp[key] = {
              billableTime: billableTime,
              nonBillableTime: nonBillableTime,
              totalTime: totalTime,
            });
      });
  });
  return fillEmptyAllocations(temp, startDate, endDate);
};

const dataFiltering = (data: any, startDate: Date, endDate: Date) => {
  const resultantArray: any = [];
  const notEmptyArr = data.filter((user: any) => user?.userName);
  notEmptyArr.map((user: any) => {
    const temp = {
      id: user?.userId,
      name: user?.userName.split(" ")[0],
      title: user?.userName,
      image: user?.userAvatar,
      isProjectAssigned: user?.projects?.length,
      team: user.team,
      timeAssigned: getTotalAssignedTime(user?.projects, startDate, endDate),
    };
    const finalData = user?.projects?.length ? { ...temp, subRows: getSubRows(user, startDate, endDate) } : temp;
    resultantArray.push(finalData);
  });
  return resultantArray;
};

// create allocation object for each date
const createAllocationDates = (allocationData: AllocationDate[], endDate: Date | any) => {
  return allocationData.reduce((accumulator, allocation) => {
    let allocationStartDate = allocation.date;
    const allocationEndDate = allocation.enddate;
    const billableTime = allocation.billableTime || 0;
    const nonBillableTime = allocation.nonBillableTime || 0;

    // allocationEndDate is not exist
    if (!allocationEndDate && allocation.frequency !== "ONGOING") {
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
        frequency: allocation.frequency,
      };

      return accumulator;
    }

    // iterate if allocationStartDate is less than or equal to endDate and allocationDate
    while (
      (allocationStartDate <= endDate && allocationStartDate <= allocationEndDate) ||
      (allocation.frequency === "ONGOING" && !allocation.enddate && allocationStartDate <= endDate)
    ) {
      // change date string format to YYYY-MM-DD
      const date = allocationStartDate.toISOString().split("T")[0];
      accumulator[date] = {
        id: allocation.id,
        billableTime: billableTime,
        nonBillableTime: nonBillableTime,
        totalTime: billableTime + nonBillableTime,
        updatedAt: allocation.updatedAt,
        frequency: allocation.frequency,
      };

      // increase one day
      allocationStartDate = dayjs(allocationStartDate).add(1, "day").toDate();
    }

    return accumulator;
  }, {} as AllocationDates);
};

export const getAllocation = async (slug: string, endDate: any, startDate: any) => {
  const userData = await db.user.findMany({
    where: { TenantId: { some: { slug } } },
    select: {
      id: true,
      name: true,
      image: true,
      Project: {
        select: {
          id: true,
          name: true,
          clientId: true,
          Client: { select: { id: true, name: true } },
          billable: true,
          Allocation: {
            select: {
              id: true,
              billableTime: true,
              nonBillableTime: true,
              updatedAt: true,
              frequency: true,
              date: true,
              enddate: true,
              projectId: true,
              userId: true,
            },
          },
        },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const allocationData = userData.map((obj, i) => {
    let allocations, totalTime, averageTime;
    return {
      userId: obj.id,
      userName: obj.name,
      userAvatar: obj.image,
      projects: obj.Project.map((project) => {
        allocations = createAllocationDates(
          project.Allocation.filter(
            (allocation) => allocation.userId === obj.id && allocation.projectId === project.id,
          ),
          endDate,
        );
        totalTime = calculateAllocationTotalTime(allocations);
        averageTime = parseFloat((totalTime / Object.keys(allocations).length).toFixed(2)) || 0;
        return {
          projectId: project.id,
          clientName: project.Client.name,
          projectName: project.name,
          billable: project.billable,
          allocations: allocations,
        };
      }),
      totalTime: totalTime,
      averageTime: averageTime,
      team: slug,
    };
  });

  return dataFiltering(allocationData, startDate, endDate);
} 