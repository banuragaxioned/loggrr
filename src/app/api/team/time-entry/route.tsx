import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";

const clientCreateSchema = z.object({
  team: z.string().min(1),
  project: z.number(),
  milestone: z.number(),
  time: z.number(),
  comments: z.string().min(1),
  billable: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = clientCreateSchema.parse(json);

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    if (user.tenants.filter((tenant) => tenant.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }
    //schema goes here

    const timeEntry = await db.timeEntry.create({
      data: {
        time: body?.time,
        comments: body?.comments,
        milestoneId: body?.milestone,
        userId: user.id,
        projectId: body?.project,
        date: new Date(),
        tenantId: user.tenants.filter((tenant) => tenant.slug === body.team)[0].id,
      },
    });

    return new Response(JSON.stringify(timeEntry));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}


export async function GET(req:Request) {
  // const {userId,team} = new URL(req.url).searchParams;
  console.log(new URL(req.url).searchParams)
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    // const json = await req.json();
    // const body = json;

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    // if (user.tenants.filter((tenant) => tenant.slug === body.team).length === 0) {
    //   return new Response("Unauthorized", { status: 403 });
    // }
    //schema goes here

    return new Response(JSON.stringify([]));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
