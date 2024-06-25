"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Edit, Trash, Hourglass, ClipboardCheck, Archive, Activity } from "lucide-react";
import { Badge } from "@tremor/react";
import { toast } from "sonner";

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

import { ProjectTaskForm } from "@/components/forms/projectTaskForm";
import { updateTaskStatus } from "@/app/_actions/update-status";

export interface TaskDataProps {
  taskList: {
    id: number;
    name: string;
    budget: number | null;
    status: string;
  }[];
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
  const params = useParams();
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
      const response = await fetch("/api/team/project/task", {
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
      {Array.isArray(taskList) && taskList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {taskList.map((item, index) => {
            const tempObj = {
              ...item,
              name: item.name,
              budget: item.budget,
              status: item.status,
            };

            const statusToUpdate = item.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";

            const updateTask = async () => {
              const response = await updateTaskStatus(params.team as string, +params.project, item.id, statusToUpdate);
              if (response) {
                toast.message(`Task ${statusToUpdate === "PUBLISHED" ? "unarchived" : "archived"}`);
                router.refresh();
              }
            };

            return (
              <Card key={index} className="group flex justify-between rounded-md border border-border p-3 shadow-none">
                <div className="flex items-center justify-start space-x-5">
                  <div className="flex gap-2">
                    {item?.budget !== null && item.budget > 0 && <Badge icon={Hourglass}>{item?.budget}</Badge>}
                    <p className="text-sm font-medium">{item?.name}</p>
                  </div>
                </div>
                <div className="invisible flex gap-1 group-hover:visible">
                  <button onClick={updateTask} title="Archive" className="p-1 hover:opacity-75">
                    {item.status === "PUBLISHED" ? <Archive size={16} /> : <Activity size={16} />}
                  </button>
                  <button
                    onClick={() => {
                      setIsFormOpen(true);
                      editEntryHandler(tempObj, item.id);
                    }}
                    title="Edit"
                    className="p-1 hover:opacity-75"
                  >
                    <Edit size={16} />
                  </button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <button title="Delete" className="p-1 hover:opacity-75">
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
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex h-[200px] flex-col items-center justify-center space-y-2 p-11 text-center shadow-none lg:h-[414px]">
          <ClipboardCheck size={24} className="hidden sm:block" />
          <h2>No tasks found!</h2>
          <p>You haven&apos;t created any task for the selected project.</p>
        </Card>
      )}
    </>
  );
};

export default TaskData;
