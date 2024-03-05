import React, { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "@/components/ui/button";

import NotepadCards from "./notepad-cards";

const NotepadResponse = ({ aiResponses, setAiResponses, projects, handleSubmit }: any) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (aiResponses.length > 0) {
      setOpen(true);
    }
    if (open && aiResponses.length === 0) {
      setOpen(false);
    }
  }, [aiResponses.length, open]);

  useEffect(() => {
    if (!open) {
      setAiResponses([]);
    }
  }, [open, setAiResponses]);

  const handleRemove = (id: number) => {
    setAiResponses(aiResponses.filter((response: any) => response.id !== id));
  };

  const renderTimeCards = aiResponses?.map((response: any, index: number) => {
    const updatedResponse = {
      ...response,
      project: projects
        .map((project: any) => ({ id: project.id, name: project.name, billable: project.billable }))
        .find((project: any) => project.id === response.id),
      comment: response.comments,
    };

    return (
      <NotepadCards
        projects={projects}
        data={updatedResponse}
        handleRemove={handleRemove}
        handleSubmit={handleSubmit}
        key={index}
        id={index + 1}
      />
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="overflow-y-auto sm:max-h-[640px] sm:max-w-4xl"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-start gap-2">Add time entries</div>
            <Button size="sm" className="mr-5" disabled>
              Submit all
            </Button>
          </DialogTitle>
          <DialogDescription className="mt-0 w-[85%]">
            This is an AI-generated response and might be inaccurate. You can click on the inputs below to update the
            response.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid grid-cols-12 justify-center gap-3">{renderTimeCards}</div>
      </DialogContent>
    </Dialog>
  );
};

export default NotepadResponse;
