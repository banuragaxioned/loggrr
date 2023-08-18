import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";
import { ProjectInterval } from "@prisma/client";

const projectCreateSchema = z.object({
  team: z.string().min(1),
  name: z.string().min(1).max(25),
  clientId: z.number().min(1).max(25),
  ownerId: z.number().min(1),
  startDate: z.date(),
  endDate: z.date().optional(),
  interval: z.nativeEnum(ProjectInterval),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = projectCreateSchema.parse(json);

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    if (user.tenants.filter((tenant) => tenant.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const project = await db.project.create({
      data: {
        name: body.name,
        Client: {
          connect: {
            id: body.clientId,
          },
        },
        Tenant: {
          connect: {
            slug: body.team,
          },
        },
        Owner: {
          connect: {
            id: body.ownerId,
          },
        },
        startdate: body.startDate,
        enddate: body.endDate,
        interval: body.interval,
      },
    });

    return new Response(JSON.stringify(project));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}