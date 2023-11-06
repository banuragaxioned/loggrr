import { notFound } from "next/navigation";
import { getAllUserProjects } from "@/server/services/project";
import { getCurrentUser } from "@/lib/session";
import { pageProps } from "@/types";
import { db } from "@/lib/db";
import { TimeLogged } from "@/components/time-logged";

export default async function Dashboard({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  const userTimeAllocated = await db.allocation.findMany({
    where: {
      userId: user.id,
    },
    select: {
      billableTime: true,
      nonBillableTime: true,
      Project: {
        select: {
          id: true,
          name: true,
        }
      },
      User: {
        select: {
          TimeEntry: {
            select: {
              projectId: true,
              time: true,
            }
          }
        }
      }
    }
  })
  const projects = await getAllUserProjects(user.id);
  const allocationData = userTimeAllocated.map((item, i) => {
    const entryValue = item.User.TimeEntry.filter((ele) => ele.projectId === item.Project.id).reduce((acc, current) => acc + current.time, 0);
    return {
      projectName:item.Project.name,
      billable:item.billableTime,
      nonBillable:item.nonBillableTime,
      entryValue
    }
  });

  return (
    <div className="col-span-12 grid w-full grid-cols-12">
      <TimeLogged team={team} projects={projects} allocationData={allocationData}/>
    </div>
  );
}
