import React, { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "@/components/ui/button";

import NotepadCards from "./notepad-cards";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

const NotepadResponse = ({ aiResponses, setAiResponses, projects }: any) => {
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

  console.log(aiResponses, "aiResponses");

  const CarouselCards = () => {
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        className="flex w-full max-w-3xl gap-3"
      >
        <CarouselContent>
          {Array.isArray(aiResponses) &&
            aiResponses?.map((response: any, index: number) => {
              const updatedResponse = {
                ...response,
                project: { id: response.id, name: response.name },
                comment: response.comments,
              };

              return (
                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <NotepadCards projects={projects} data={updatedResponse} />
                  </div>
                </CarouselItem>
              );
            })}
        </CarouselContent>
        <CarouselPrevious disabled={aiResponses?.length < 3} />
        <CarouselNext disabled={aiResponses?.length < 3} />
      </Carousel>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto sm:max-h-[640px] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              Add time entries
              <span className="text-xs">(AI generated)</span>
            </div>
            <Button size="sm" variant="outline" className="mr-4">
              Log all
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-3">
          <CarouselCards />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotepadResponse;
