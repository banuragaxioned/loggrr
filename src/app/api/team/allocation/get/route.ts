import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";
import { AllocationFrequency } from "@prisma/client";
import { AllocationDates } from "@/types";
import dayjs from "dayjs";

const allocationCreateSchema = z.object({
  team: z.string().min(1),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
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

// create allocation object for each date
const createAllocationDates = (allocationData: AllocationDate[], endDate: Date | any) => {
  return allocationData.reduce((accumulator, allocation) => {
    let allocationStartDate = allocation.date;
    const allocationEndDate = allocation.enddate;
    const billableTime = allocation.billableTime || 0;
    const nonBillableTime = allocation.nonBillableTime || 0;
    
    // allocationEndDate is not exist
    if (!allocationEndDate && allocation.frequency !== 'ONGOING') {
      // change date string format to YYYY-MM-DD
      const date = allocationStartDate.toLocaleString().split("T")[0];
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
    while (((allocationStartDate <= endDate && allocationStartDate <= allocationEndDate) ||(!allocationEndDate && allocationStartDate <= endDate ))) {
      // change date string format to YYYY-MM-DD
      const date = allocationStartDate.toLocaleString().split("T")[0];

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

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    if (user.tenants.filter((tenant) => tenant.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const client = await db.user.findMany({
      where: { TenantId: { some: { slug: body.team } } },
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
              where: {
                OR: [
                  {
                    enddate: null,
                  },
                  {
                    enddate: {
                      gte: body.startDate,
                    },
                  },
                ],
              },
              select: {
                id: true,
                billableTime: true,
                nonBillableTime: true,
                updatedAt: true,
                frequency: true,
                date: true,
                enddate: true,
                projectId:true,
                userId:true
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const allocationData = client.map((obj, i) => {
      let allocations, totalTime, averageTime;
      return {
        userId: obj.id,
        userName: obj.name,
        userAvatar: obj.image,
        projects: obj.Project.map((project) => {
          allocations = createAllocationDates(project.Allocation.filter((allocation)=>allocation.userId === obj.id && allocation.projectId === project.id), body.endDate);
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
      };
    });
    return new Response(JSON.stringify(allocationData));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
