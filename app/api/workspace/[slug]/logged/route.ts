import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { getLogged } from "@/server/services/time-entry";

// GET /api/workspace/[slug]/allocation - get all allocations for a workspace
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const slug = params.slug;
  try {
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    if (user.workspaces.filter((workspace) => workspace.slug === slug).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const response = await getLogged(slug);

    return new Response(JSON.stringify(response));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
