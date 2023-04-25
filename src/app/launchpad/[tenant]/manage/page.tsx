import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { tenant: string } }) {
  const user = await getCurrentUser();
  const currentTeam = params.tenant;

  const projects = await db.project.findMany({
    where: {
      Tenant: {
        slug: currentTeam,
      },
    },
    select: {
      id: true,
      name: true,
      startdate: true,
      enddate: true,
      billable: true,
      interval: true,
      Client: { select: { id: true, name: true } },
      Owner: { select: { id: true, name: true, image: true } },
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <>
      <p>Test</p>
      {projects?.length ? (
        <div className="divide-border divide-y rounded-md border">
          {projects.map((project) => (
            <div key={project.id}>{project.name}</div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">No projects found</p>
        </div>
      )}
    </>
  );
}
