import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import * as z from "zod";

const memberSchema = z.object({
    team: z.string().min(1),
  });
  
export const POST  = async (req : Request) => {
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
            const roles = await db.tenant.findUnique({
              where: { slug: body.team },
              select: {
                UserRole: {
                  select: {
                    id: true,
                    userId: true,
                    role: true,
                    User: {
                      select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            });
          
            const members = await roles?.UserRole.map((obj) => {
              const id = obj.id;
              const role = obj.role;
              const user = obj.User;
              return { id, userId: user?.id, name: user?.name, avatar: user?.image, mail: user?.email, role };
            });

        return new Response(JSON.stringify({ members }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          return new Response(JSON.stringify(error.issues), { status: 422 });
        }
    
        return new Response(null, { status: 500 });
      }
    
};
