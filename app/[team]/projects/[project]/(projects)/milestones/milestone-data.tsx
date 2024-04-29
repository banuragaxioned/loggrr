"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit, Hourglass, Trash } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@tremor/react";

import { Card } from "@/components/ui/card";
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

export interface MilestoneDataProps {
  milestoneList: {
    id: number;
    name: string;
    budget: number | null;
  }[];
  team: string;
  project: number;
}

export interface EditReferenceObj {
  obj: any;
  isEditing: boolean;
  id: number | null;
}

const MilestoneData = ({ milestoneList, team, project }: MilestoneDataProps) => {
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.isArray(milestoneList) && milestoneList.length ? (
          milestoneList.map((item, index) => {
            const tempObj = {
              ...item,
              name: item.name,
              budget: item.budget,
            };

            return (
              <Card key={index} className="group flex justify-between rounded-md border border-border p-3 shadow-none">
                <div className="flex items-center justify-start space-x-5">
                  <div className="flex gap-2">
                    {item.budget !== null && item.budget > 0 && <Badge icon={Hourglass}>{item.budget}</Badge>}
                    <h4 className="text-base">{item.name}</h4>
                  </div>
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
                          This action cannot be undone. This will permanently delete your milestone and all assocaited
                          time entries.
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
              </Card>
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
