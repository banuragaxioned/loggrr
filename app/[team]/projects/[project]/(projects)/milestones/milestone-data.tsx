"use client";

import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export interface MiilestoneDataProps {
  milestoneList: Array<any>;
  team: string;
  project: number;
}

export interface EditReferenceObj {
  obj: any;
  isEditing: boolean;
  id: number | null;
}

const MilestoneData = ({ milestoneList, team, project }: MiilestoneDataProps) => {
  const router = useRouter();
  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        router.refresh();
      } else {
        toast.error("Failed to delete milestone");
      }
    } catch (error) {
      console.error("Error in deleting milestone", error);
    }
  };

  return (
    <>
      <NewMilestoneForm
        project={project}
        team={team}
        edit={edit}
        setEdit={setEdit}
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
      />
      <div className="flex flex-wrap gap-5 mt-7">
        {Array.isArray(milestoneList) && milestoneList.length ? (
          milestoneList.map((item, index) => {
            const tempObj = {
              ...item,
              name: item.name,
              budget: item.budget,
              startDate: item.startDate,
              endDate: item.endDate,
            };

            return (
              <div key={index} className="group flex w-[45%] justify-between rounded-md border p-3">
                <div>
                  <p className="capitalize">Name: {item.name}</p>
                  <p>
                    Time Period: {format(item?.startDate, "MMM dd, yyyy")} - {format(item?.endDate, "MMM dd, yyyy")}
                  </p>
                  <p>Total Budget (Hrs) : {item.budget}</p>
                </div>
                <div className="invisible flex gap-4 group-hover:visible">
                  <button
                    onClick={() => {
                      setIsFormOpen(true);
                      editEntryHandler(tempObj, item.id);
                    }}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <button title="Delete">
                        <Trash size={16} className="text-destructive" />
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
            );
          })
        ) : (
          <p className="mt-7 text-gray-500">No Milestones Found</p>
        )}
      </div>
    </>
  );
};

export default MilestoneData;
