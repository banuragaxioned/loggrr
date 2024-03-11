import React, { FormEvent, useEffect, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "./ui/dialog";
import { Button } from "@/components/ui/button";

import NotepadCards from "./notepad-cards";
import { ScrollArea } from "./ui/scroll-area";
import { Project } from "@/types";
import { SelectedData } from "./forms/timelogForm";

const NotepadResponse = ({
  aiResponses,
  setAiResponses,
  projects,
  handleSubmit,
  handleSubmitAll,
}: {
  aiResponses: Project[];
  setAiResponses: (args0: any) => any;
  projects: Project[];
  handleSubmit: (e: FormEvent, clearForm: Function | null, selectedData?: SelectedData, isMultiple?: boolean) => void;
  handleSubmitAll: (e: FormEvent, args0: any) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [allData, setAllData] = useState<Project[]>([]);

  useEffect(() => {
    if (aiResponses.length > 0) {
      setAllData(aiResponses);
      setOpen(true);
    }
    if (open && aiResponses.length === 0) {
      setOpen(false);
    }
  }, [aiResponses, open]);

  useEffect(() => {
    if (!open) {
      setAiResponses([]);
    }
  }, [open, setAiResponses]);

  const handleRemove = (id: string) => {
    if (id) {
      setAiResponses(aiResponses.filter((response) => response.uuid !== id));
    }
  };

  const renderTimeCards = aiResponses?.map((response, index: number) => {
    return (
      <NotepadCards
        key={response.uuid}
        id={index + 1}
        projects={projects}
        data={response}
        handleRemove={handleRemove}
        handleSubmit={handleSubmit}
        allData={allData}
        setAllData={setAllData}
      />
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[calc(100%-44px)] overflow-y-auto p-0 lg:max-w-4xl"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        removeClose
        tabIndex={-1}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-start gap-2">Add time entries</div>
            <div>
              <Button
                size="sm"
                className={`mr-2 ${aiResponses.length > 1 ? "visible" : "invisible"}`}
                onClick={(e) => handleSubmitAll(e, allData)}
                title="Click here to submit all valid time entries"
              >
                Submit all
              </Button>
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Dismiss
                </Button>
              </DialogClose>
            </div>
          </DialogTitle>
          <DialogDescription className="mt-0 w-[85%] text-left">
            This is an AI-generated response and might be inaccurate. You can click on the inputs below to update the
            response.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[302px]">
          <div className="grid grid-cols-12 justify-center gap-3 px-6 pb-6 pt-3">{renderTimeCards}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotepadResponse;
