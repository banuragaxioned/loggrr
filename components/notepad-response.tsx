import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const NotepadResponse = ({ aiResponses, setAiResponses }: any) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (aiResponses.length > 0) {
      setOpen(true);
    }
  }, [aiResponses.length]);

  useEffect(() => {
    if (!open) {
      setAiResponses([]);
    }
  }, [open, setAiResponses]);

  const renderTimeCards = aiResponses?.map((response: any, index: number) => {
    return (
      <div key={index}>
        <p>{response.projectName}</p>
        <p>{response.time}</p>
      </div>
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-2">
            Add time entries
            <span className="text-xs">(AI generated)</span>
          </DialogTitle>
          <div>{renderTimeCards}</div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NotepadResponse;
