import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import * as z from "zod";

const memberSchema = z.object({
  team: z.string().min(1),
});

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = memberSchema.parse(json);

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    if (user.tenants.filter((tenant) => tenant.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }
    const memberList = await db.tenant.findUnique({
      where: { slug: body.team },
      select: {
        Users: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            status: true,
            Roles: {
              select: {
                role: true,
              },
            },
          },
        },
      },
    });

    const members = await memberList?.Users.map((member) => {
      const role = member.Roles[0].role;
      return {
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        role: role,
      };
    });

    return new Response(JSON.stringify({ members }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
};
