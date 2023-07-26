import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";



const allocationCreateSchema = z.object({
  billable:z.coerce.number().optional(),
  nonBillable:z.coerce.number().min(1),
  total:z.coerce.number().min(1),
  onGoing:z.coerce.boolean(),
  startDate:z.coerce.date().optional(),
  endDate:z.coerce.date().optional(),
  projectId:z.coerce.number().min(1),
  userId:z.coerce.number().min(1),
  team:z.string().min(1)
});

const updatedAllocation = async (requiredAllocation: any, data: any, range: any) => {
  const { total, billable, nonBillable } = data;
  const { from, to, onGoing } = range;
  return await db.allocation.update({
    where: {
      id: requiredAllocation?.id,
    },
    data: {
      billableTime: billable,
      nonBillableTime: nonBillable,
      frequency: onGoing ? "ONGOING" : "DAY",
      date: from,
      enddate: to,
      updatedAt:new Date().toISOString(),
    },
  });
};

const insertAllocation = async (data: any, range: any,userId:number,projectId:number,team:string) => {
  const { total, billable, nonBillable } = data;
  const { from, to, onGoing } = range;
  return await db.allocation.create({
    data: {
      billableTime: billable,
      nonBillableTime: nonBillable,
      frequency: onGoing ? "ONGOING" : "DAY",
      date: from,
      enddate: to,
      createdAt:new Date().toISOString(),
      updatedAt:new Date().toISOString(),
        Tenant: {
          connect: { slug:team},
        },
        Project: {
          connect: { id: projectId },
        },
        User: {
          connect: { id: userId },
        },
    },
  });
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
  
      const getAllocationData = await db.allocation.findMany({
        select: {
          id: true,
          userId: true,
          Project: true,
          projectId: true,
          frequency: true,
          date: true,
          enddate: true,
        },
      });
      
      const data = {
        total:body.total,
        billable:body.billable,
        nonBillable:body.nonBillable
      }

      const range = {
        from:body.startDate,
        to:body.endDate,
        onGoing:body.onGoing
      }

      const requiredAllocation = getAllocationData.find((obj) => obj.projectId === body.projectId && obj.userId === body.userId );
      const response = requiredAllocation?.id
        ? await updatedAllocation(requiredAllocation, data, range)
        : await insertAllocation(data, range,body.projectId,body.userId,body.team);
        
    return new Response(JSON.stringify({response}));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
