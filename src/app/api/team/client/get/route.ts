import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";

export async function GET(req : Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const team = new URL(req.url).searchParams.get('team')

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.

    const clients = await db.client.findMany({
      where: { Tenant: { slug: team as string } },
      select: {
        id: true,
        name: true,
        status: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return new Response(JSON.stringify(clients));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
