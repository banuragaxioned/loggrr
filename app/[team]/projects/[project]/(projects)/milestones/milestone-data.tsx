'use client';

import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";

const MilestoneData = ({ milestoneList, team, project }: { milestoneList: any[], team: string, project: number }) => {

  const deleteMilestone = async (id: number) => {
    try {
      const response = await fetch("/api/team/project/milestones", {
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
    } catch (error) {
      console.error("Error in deleting milestone", error);
    }
  }

  const editMilestone = async (id: number, value: string, budget: number, startDate: string, endDate: string) => {
    try {
      const response = await fetch("/api/team/project/milestones", {
        method: "PUT",
        body: JSON.stringify({
          id,
          name: value,
          team,
          budget,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        toast.success("Milestone updated successfully");
      } else {
        toast.error("Failed to update milestone");
      }
    } catch (error) {
      console.error("Error in updating milestone", error);
    }
  };

  return (
    <div className="mt-7">
      {milestoneList.length ? <span className="inline-block capitalize text-gray-500 mb-2">{team}</span> : null}
      {Array.isArray(milestoneList) && milestoneList.length ? milestoneList.map((item, index) => {
        return (
          <div key={index} className="border p-3 rounded-md mb-5 flex justify-between">
            <div>
              <h4 className="capitalize">{`Milestone name : ${item.name}`}</h4>
              <p>{`Month cycle: ${item?.startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${item?.endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}</p>
              <p>{`Budget : ${item.budget}`}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => editMilestone(item.id, item.name, item.budget, item.startDate, item.endDate)} title="Edit">
                <Edit height={22} width={22} />
              </button>
              <button onClick={() => deleteMilestone(item.id)} title="Delete">
                <Trash height={22} width={22} color="red" />
              </button>
            </div>
          </div>
        )
      }) : <p className="text-gray-500">No Milestones Found</p>}
    </div>
  )
}

export default MilestoneData;