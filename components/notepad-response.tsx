import React, { useEffect, useState } from "react";
import { CircleDollarSign, Folder, Check, Ban } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { SelectedData } from "./forms/timelogForm";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";

import { cn } from "@/lib/utils";
import { Project, Milestone } from "@/types";

const initialDataState = {
  client: undefined,
  project: undefined,
  milestone: null,
  task: null,
  comment: "",
  time: "",
  billable: false,
};

type ErrorsObj = {
  time?: boolean;
};

const NotepadResponse = ({ aiResponses, setAiResponses, projects }: any) => {
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData>(initialDataState);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [projectTasks, setprojectTasks] = useState<Milestone[]>([]);
  const [errors, setErrors] = useState<ErrorsObj>({});

  const isProjectAndMilestoneSelected = selectedData?.project?.id && selectedData?.milestone?.id;

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

  const dropdownSelectHandler = (selected: string, arr: Milestone[], callback: Function) => {
    const foundData = arr.find((obj) => obj.id === +selected);
    console.log(arr, "arr");
    
    callback(foundData);
  };

  const handleLoggedTimeInput = (time: string) => {
    const numberPattern = new RegExp(/^([1-9]\d*(\.|\:)\d{0,2}|0?(\.|\:)\d*[1-9]\d{0,2}|[1-9]\d{0,2})$/, "g");
    numberPattern.test(time) ? setErrors({ ...errors, time: false }) : setErrors({ ...errors, time: true });
    setSelectedData({ ...selectedData, time: time });
  };

  const projectCallback = (selected: Project) => {
    setSelectedData({
      ...selectedData,
      client: selected?.client,
      project: { id: selected.id, name: selected?.name, billable: selected?.billable },
    });
    setProjectMilestones(() => {
      const milestone = selected?.milestone;
      return milestone ? milestone : [];
    });
    setprojectTasks(() => {
      const task = selected?.task;
      return task ? task : [];
    });
    if (selected.id !== selectedData.project?.id) {
      setSelectedData((prevData: any) => {
        return {
          ...prevData,
          milestone: undefined,
          task: undefined,
          billable: prevData.project?.billable ? true : false,
        };
      });
    }
  };

  const setCommentText = (str: string) => setSelectedData({ ...selectedData, comment: str });

  console.log(aiResponses, "aiResponses");

  const renderTimeCards = aiResponses?.map((response: any, index: number) => {
    return (
      <Card className="overflow-hidden p-0 shadow-none" key={index}>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <p className="text-sm font-medium text-muted-foreground">Time entries</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-4 pt-0">
          <ComboBox
            tabIndex={1}
            searchable
            icon={<Folder size={16} />}
            options={projects}
            label="Project"
            selectedItem={response?.projectName}
            handleSelect={(selected) => dropdownSelectHandler(selected, projects, projectCallback)}
          />
          <ComboBox
            tabIndex={1}
            searchable
            icon={<Folder size={16} />}
            options={projects}
            label="Milestones"
            selectedItem={selectedData?.project}
            handleSelect={(selected) => dropdownSelectHandler(selected, projects, projectCallback)}
          />
          <ComboBox
            tabIndex={1}
            searchable
            icon={<Folder size={16} />}
            options={projects}
            label="Task"
            selectedItem={selectedData?.project}
            handleSelect={(selected) => dropdownSelectHandler(selected, projects, projectCallback)}
          />
          <div className="flex flex-row gap-2">
            <Button
              tabIndex={isProjectAndMilestoneSelected ? 5 : -1}
              variant="outline"
              size="icon"
              type="button"
              onClick={() =>
                selectedData?.project?.billable &&
                setSelectedData((prev) => ({ ...prev, billable: !selectedData?.billable }))
              }
              className={cn(
                selectedData.billable && "text-success hover:text-success",
                !selectedData.billable && "text-slate-400 hover:text-slate-400",
              )}
            >
              <CircleDollarSign size={20} />
            </Button>
            <Input
              tabIndex={isProjectAndMilestoneSelected ? 6 : -1}
              type="text"
              placeholder="2:30"
              className={cn(
                errors?.time
                  ? "border-destructive px-4 ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary focus:ring-primary",
                "placeholder:text-disabled-light focus:outline-none` h-9 w-[66px] select-none rounded-md border bg-transparent py-1 text-center text-sm leading-none transition-all duration-75 ease-out",
              )}
              value={response.time}
              onChange={(e) => handleLoggedTimeInput(e.currentTarget.value)}
              disabled={!isProjectAndMilestoneSelected}
            />
          </div>
          <input
            tabIndex={isProjectAndMilestoneSelected ? 4 : -1}
            className="placeholder:text-info-light peer-focus:bg-background-dark w-full select-none border-0 bg-transparent px-2 py-1.5 text-sm focus:outline-0 focus:ring-0"
            placeholder="Comments"
            value={response.comment ?? ""}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex flex-row justify-between">
            <Button type="button" variant="outline" size="icon" title="Cancel">
              <Ban size={16} />
            </Button>
            <Button type="button" variant="outline" size="icon" title="Add">
              <Check size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl sm:max-h-[640px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-2">
            Add time entries
            <span className="text-xs">(AI generated)</span>
          </DialogTitle>
          <Button size="sm" className="flex items-center">Log all</Button>
        </DialogHeader>
        <div className="flex flex-wrap gap-3">{renderTimeCards}</div>
      </DialogContent>
    </Dialog>
  );
};

export default NotepadResponse;
