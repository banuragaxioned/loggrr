import React, { useEffect, useState } from "react";
import { CircleDollarSign, Folder, Check, Ban, Rocket, List } from "lucide-react";

import { ComboBox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { SelectedData } from "./forms/timelogForm";

import { cn } from "@/lib/utils";
import { Project, Milestone } from "@/types";
import { Button } from "./ui/button";

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

const NotepadCards = ({
  projects,
  data,
  handleRemove,
}: {
  projects: Project[];
  data: any;
  handleRemove: (id: number) => void;
}) => {
  const [selectedData, setSelectedData] = useState<SelectedData>(initialDataState);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [projectTasks, setprojectTasks] = useState<Milestone[]>([]);
  const [errors, setErrors] = useState<ErrorsObj>({});

  const isProjectAndMilestoneSelected = selectedData?.project?.id && selectedData?.milestone?.id;

  const formValidator = () => {
    const { project, comment, time, milestone } = selectedData || {};
    return project && milestone && comment?.trim().length && time && !errors?.time;
  };

  const dropdownSelectHandler = (selected: string, arr: Milestone[], callback: Function) => {
    const foundData = arr.find((obj) => obj.id === +selected);
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
      project: { id: selected.id, name: selected?.name },
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

  const milestoneCallback = (selected: Milestone) => setSelectedData((prev) => ({ ...prev, milestone: selected }));

  const taskCallback = (selected: Milestone) => {
    const data: SelectedData = { ...selectedData, task: selected };
    setSelectedData(data);
  };

  const setCommentText = (str: string) => setSelectedData({ ...selectedData, comment: str });

  useEffect(() => {
    const foundProject = projects.find((project) => project.id === data.project?.id);
    setSelectedData(data);
    setProjectMilestones(() => {
      const milestone = foundProject?.milestone;
      return milestone ? milestone : [];
    });
    setprojectTasks(() => {
      const task = foundProject?.task;
      return task ? task : [];
    });
  }, [data, projects]);

  return (
    <Card className="col-span-4 overflow-hidden p-0 shadow-none">
      <CardContent className="flex flex-col gap-3 p-4">
        <ComboBox
          searchable
          icon={<Folder size={16} />}
          options={projects}
          label="Project"
          selectedItem={selectedData?.project}
          handleSelect={(selected) => dropdownSelectHandler(selected, projects, projectCallback)}
        />
        <ComboBox
          searchable
          icon={<Rocket size={16} />}
          options={projectMilestones}
          label="Milestones"
          selectedItem={selectedData?.milestone}
          handleSelect={(selected) => dropdownSelectHandler(selected, projectMilestones, milestoneCallback)}
          disabled={!selectedData?.project?.id}
        />
        <ComboBox
          searchable
          icon={<List size={16} />}
          options={projectTasks}
          label="Task"
          selectedItem={selectedData?.task}
          handleSelect={(selected) => dropdownSelectHandler(selected, projectTasks, taskCallback)}
          disabled={!isProjectAndMilestoneSelected}
        />
        <div className="flex flex-row gap-2">
          {selectedData.project?.billable && (
            <Button
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
          )}
          <Input
            type="text"
            placeholder="2:30"
            className={cn(
              errors?.time
                ? "border-destructive px-4 ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                : "border-border focus:border-primary focus:ring-primary",
              "placeholder:text-disabled-light ml-auto h-9 w-[120px] select-none rounded-md border bg-transparent py-1 text-center text-sm leading-none transition-all duration-75 ease-out focus:outline-none",
            )}
            value={selectedData.time}
            onChange={(e) => handleLoggedTimeInput(e.currentTarget.value)}
            disabled={!isProjectAndMilestoneSelected}
          />
        </div>
        <Input
          placeholder="Comments"
          value={selectedData.comment ?? ""}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex flex-row justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            title="Remove entry"
            onClick={() => selectedData.project && handleRemove(selectedData.project?.id)}
          >
            <Ban size={16} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Submit entry" disabled={!formValidator()}>
            <Check size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotepadCards;
