import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";

const userSchema = z.object({
  team: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = userSchema.parse(json);

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    if (user.tenants.filter((tenant) => tenant.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const clients = await db.client.findMany({
      where: { Tenant: { slug: body.team } },
      select: {
        id: true,
        name: true,
        status: true,
        Project: {
          distinct: "name",
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const structureClients = clients.map((client) => ({ ...client, Project: client.Project.length }));

    return new Response(JSON.stringify(structureClients));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
