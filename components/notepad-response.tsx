import React, { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "@/components/ui/button";

import NotepadCards from "./notepad-cards";

const NotepadResponse = ({ aiResponses, setAiResponses, projects }: any) => {
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

    return <NotepadCards projects={projects} data={updatedResponse} handleRemove={handleRemove} key={index} />;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto sm:max-h-[640px] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              Add time entries
              <span className="text-xs">(AI generated)</span>
            </div>
            <Button size="sm" className="mr-5" disabled>
              Log all
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-12 justify-center gap-3">{renderTimeCards}</div>
      </DialogContent>
    </Dialog>
  );
};

export default NotepadResponse;
