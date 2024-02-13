import { NewMilestoneForm } from "@/components/forms/milestonesForm";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { db } from "@/server/db";
import { pageProps } from "@/types";
import { getProjects } from "@/server/services/project";
import { toast } from "sonner";

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  if (!project) {
    return null;
  }

  const projectList = await getProjects(team);

  const milestoneList = await db.milestone.findMany({
    where: {
      workspace: {
        slug: team,
      },
      project: {
        id: +project,
      },
    },
  });
  console.log(milestoneList, 'milestone', team);

  const deleteMilestone = async (id: number) => {
    const response = await fetch("/api/team/project/milestones/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        team,
      }),
    });

    if (response.ok) {
      toast.success("Milestone deleted successfully");
    } else {
      toast.error("Failed to delete milestone");
    }
  }

  const editMilestone = async (id: number, value: string) => {
    const response = await fetch("/api/team/project/milestones/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name: value,
        team,
      }),
    });

    if (response.ok) {
      toast.success("Milestone updated");
    } else {
      toast.error("Failed to update milestone");
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Milestones" text="Manage all the Milestones for your project">
        <NewMilestoneForm project={project} team={team} />
      </DashboardHeader>

      <div className="mt-7">
        <span className="inline-block capitalize text-gray-500 mb-2">{team}</span>
        {milestoneList && milestoneList.map((item, index) => {
          return (
            <div key={index} className="border p-3 rounded-md mb-5">
              <div>
                <h4 className="capitalize">{`Milestone name : ${item.name}`}</h4>
                <p>{`Month cycle: ${item?.startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${item?.endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}</p>
                <p>{`Budget : ${item.budget}`}</p>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardShell>
  );
}
