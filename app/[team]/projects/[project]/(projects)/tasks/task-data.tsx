"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
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

import { ProjectTaskForm } from "@/components/forms/projectTaskForm";

export interface TaskDataProps {
  taskList: Array<any>;
  team: string;
  project: number;
}

export interface EditReferenceObj {
  obj: any;
  isEditing: boolean;
  id: number | null;
}

const TaskData = ({ taskList, team, project }: TaskDataProps) => {
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

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch("/api/team/project/tasks", {
        method: "DELETE",
        body: JSON.stringify({
          id,
          team,
          projectId: +project,
        }),
      });

      if (response.ok) {
        toast.success("Task deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error in deleting task", error);
    }
  };

  return (
    <>
      <ProjectTaskForm
        project={project}
        team={team}
        edit={edit}
        setEdit={setEdit}
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
      />
      <div className="mt-7 flex flex-wrap gap-5">
        {Array.isArray(taskList) && taskList.length ? (
          taskList.map((item, index) => {
            const tempObj = {
              ...item,
              name: item.name,
              budget: item.budget,
            };

            return (
              <div key={index} className="group flex w-[45%] justify-between rounded-md border p-3">
                <div>
                  <p className="capitalize">Name: {item.name}</p>
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
                        <DialogTitle>Are you sure to delete this task?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your task.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button type="button" variant="outline" size="sm" asChild>
                          <DialogClose>Cancel</DialogClose>
                        </Button>
                        <Button type="button" size="sm" onClick={() => deleteTask(item.id)} asChild>
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

export default TaskData;
