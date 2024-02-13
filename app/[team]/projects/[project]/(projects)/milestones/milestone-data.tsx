'use client';

import { Delete, Edit } from "lucide-react";
import { toast } from "sonner";

const MilestoneData = ({ milestoneList, team, project }: { milestoneList: any[], team: string, project: number }) => {

  const deleteMilestone = async (id: number) => {
    const response = await fetch("/api/team/project/milestones/delete", {
      method: "DELETE",
      body: JSON.stringify({
        id,
        team,
        projectId: +project,
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
      body: JSON.stringify({
        id,
        name: value,
        team,
      }),
    });

    if (response.ok) {
      toast.success("Milestone updated successfully");
    } else {
      toast.error("Failed to update milestone");
    }
  };

  return (
    <div className="mt-7">
      {milestoneList.length && <span className="inline-block capitalize text-gray-500 mb-2">{team}</span>}
      {Array.isArray(milestoneList) && milestoneList.length && milestoneList.map((item, index) => {
        return (
          <div key={index} className="border p-3 rounded-md mb-5 flex justify-between">
            <div>
              <h4 className="capitalize">{`Milestone name : ${item.name}`}</h4>
              <p>{`Month cycle: ${item?.startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${item?.endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}</p>
              <p>{`Budget : ${item.budget}`}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => editMilestone(item.id, item.name)} title="Edit">
                <Edit height={22} width={22} />
              </button>
              <button onClick={() => deleteMilestone(item.id)} title="Delete">
                <Delete height={22} width={22} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MilestoneData;