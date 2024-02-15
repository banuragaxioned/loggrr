'use client';

import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { NewMilestoneForm } from "@/components/forms/milestonesForm";

export interface MiilestoneDataProps {
  milestoneList: Array<any>;
  team: string;
  project: number;
}

export interface EditReferenceObj {
  obj: any;
  isEditing: boolean;
  id: number | null
}

const MilestoneData = ({ milestoneList, team, project }: MiilestoneDataProps) => {

  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [milestones, setMilestones] = useState(milestoneList);

  const editEntryHandler = (obj: any, id: number) => {
    const currentlyEditing = edit.id;
    if (currentlyEditing === id) {
      setEdit({ obj: {}, isEditing: false, id: null });
    } else {
      setEdit({ obj, isEditing: true, id });
    }
  };

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
        setMilestones(milestones.filter((item) => item.id !== id));
      } else {
        toast.error("Failed to delete milestone");
      }
    } catch (error) {
      console.error("Error in deleting milestone", error);
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Milestones" text="Manage all the Milestones for your project">
        <NewMilestoneForm project={project} team={team} edit={edit} setEdit={setEdit} isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} milestones={milestones} setMilestones={setMilestones} />
      </DashboardHeader>

      {milestones.length ? <span className="inline-block capitalize text-gray-500 mt-7">{team}</span> : null}
      <div className="flex gap-5 flex-wrap">
        {Array.isArray(milestones) && milestones.length ? milestones.map((item, index) => {
          const tempObj = {
            ...item,
            name: item.name,
            budget: item.budget,
            startDate: item.startDate,
            endDate: item.endDate,
          }

          const isEditing = edit.isEditing && edit.id === item.id;

          return (
            <div key={index} className="w-[45%] border p-3 rounded-md flex justify-between group">
              <div>
                <h4 className="capitalize">{`Milestone name : ${item.name}`}</h4>
                <p>{`Month cycle: ${item?.startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${item?.endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}</p>
                <p>{`Total Budget (Hrs) : ${item.budget}`}</p>
              </div>
              <div className="flex gap-4 group-hover:visible invisible">
                <button onClick={() => {
                  setIsFormOpen(true);
                  editEntryHandler(tempObj, item.id)}} title="Edit">
                  <Edit height={22} width={22} />
                </button>

                <Dialog>
                  <DialogTrigger asChild>
                    <button title="Delete">
                      <Trash height={22} width={22} color="red" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Are you sure to delete this milestone?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your milestone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="button" variant="outline" size="sm" asChild>
                        <DialogClose>Cancel</DialogClose>
                      </Button>
                      <Button type="button" size="sm" onClick={() => deleteMilestone(item.id)} asChild>
                        <DialogClose>Delete</DialogClose>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )
        }) : <p className="text-gray-500 mt-7">No Milestones Found</p>}
      </div>
    </DashboardShell>
  )
}

export default MilestoneData;
