"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Hourglass, Milestone as CategoryIcon, Trash, Archive, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@tremor/react";
import { Badge as CnBadge } from "@/components/ui/badge";

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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { NewMilestoneForm } from "@/components/forms/milestonesForm";
import { updateMilestoneStatus } from "@/app/_actions/update-status";

interface ListProps {
  id: number;
  name: string;
  budget: number | null;
  status: string;
}

export interface MilestoneDataProps {
  milestoneList: ListProps[];
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
      const response = await fetch("/api/team/project/category", {
        method: "DELETE",
        body: JSON.stringify({
          id,
          team,
          projectId: +project,
        }),
      });

      if (response.ok) {
        toast.success("Category deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error in deleting category", error);
    }
  };

  const archivedMilestones = milestoneList.filter((milestone) => milestone.status === "ARCHIVED");
  const publishedMilestones = milestoneList.filter((milestone) => milestone.status === "PUBLISHED");

  const List = (data: ListProps[]) => (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {data.map((item, index) => {
        const tempObj = {
          ...item,
          name: item.name,
          budget: item.budget,
          status: item.status,
        };

        const statusToUpdate = item.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";

        const updateMilestone = async () => {
          const response = await updateMilestoneStatus(team, +project, item.id, statusToUpdate);
          if (response) {
            toast.message(`Category ${statusToUpdate === "PUBLISHED" ? "unarchived" : "archived"}`);
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
            <div className="flex gap-1 group-hover:visible md:invisible">
              <button
                onClick={updateMilestone}
                title={item.status === "PUBLISHED" ? "Archive" : "Unarchive"}
                className="p-1 hover:opacity-75"
              >
                {item.status === "PUBLISHED" ? <Archive size={16} /> : <ArchiveRestore size={16} />}
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
                    <DialogTitle>Are you sure to delete this category?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your category.
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
      })}
    </div>
  );

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
      {Array.isArray(milestoneList) && milestoneList.length ? (
        <div className="flex flex-col gap-4">
          {publishedMilestones.length > 0 && List(publishedMilestones)}
          {archivedMilestones.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="archived" className="border-none">
                <AccordionTrigger className="text-base font-normal tracking-normal hover:no-underline">
                  <span>
                    Archived
                    <CnBadge variant="secondary" className="ml-2">
                      {archivedMilestones.length}
                    </CnBadge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>{List(archivedMilestones)}</AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      ) : (
        <Card className="flex h-[200px] flex-col items-center justify-center space-y-2 p-11 text-center shadow-none lg:h-[414px]">
          <CategoryIcon size={24} className="hidden sm:block" />
          <h2>No categories found!</h2>
          <p>You haven&apos;t created any category for the selected project.</p>
        </Card>
      )}
    </>
  );
};

export default MilestoneData;
