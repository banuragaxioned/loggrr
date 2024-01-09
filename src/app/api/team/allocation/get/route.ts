import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";
import { AllocationFrequency } from "@prisma/client";
import { AllocationDates } from "@/types";
import dayjs from "dayjs";

const allocationCreateSchema = z.object({
  team: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  page: z.coerce.number().min(1),
  pageSize: z.coerce.number().min(1),
});

interface AllocationDate {
  id: number;
  billableTime: number;
  nonBillableTime: number;
  updatedAt: Date;
  frequency: AllocationFrequency;
  date: Date;
  enddate: Date | any;
}

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
      skills: user.skills,
      usergroup: user.usergroup,
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = allocationCreateSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const userData = await db.user.findMany({
      where: { Workspace: { some: { slug: body.team } } },
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
        SkillScore: {
          where: { Workspace: { slug: body.team } },
          select: {
            level: true,
            Skill: {
              select: {
                name: true,
              },
            },
          },
        },
        UserGroup: {
          where: { Workspace: { slug: body.team } },
          select: {
            id: true,
            name: true,
          },
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
        skills: obj.SkillScore.map((item) => {
          return {
            level: item.level,
            skill: item.Skill.name,
          };
        }),
        usergroup: obj.UserGroup,
        projects: obj.Project.map((project) => {
          allocations = createAllocationDates(
            project.Allocation.filter(
              (allocation) => allocation.userId === obj.id && allocation.projectId === project.id,
            ),
            body.endDate,
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
        team: body.team,
      };
    });
    return new Response(JSON.stringify(dataFiltering(allocationData, body.startDate, body.endDate)));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
