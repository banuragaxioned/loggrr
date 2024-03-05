import React, { useEffect, useState } from "react";
import { CircleDollarSign, Folder, Check, Rocket, List, X } from "lucide-react";
import { motion } from "framer-motion";

import { ComboBox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "./ui/card";
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
  handleSubmit,
  id,
}: {
  projects: Project[];
  data: any;
  handleRemove: (id: number) => void;
  handleSubmit: (e: any, clearForm: any, data: SelectedData) => void;
  id: number;
}) => {
  const [selectedData, setSelectedData] = useState<SelectedData>(initialDataState);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [projectTasks, setprojectTasks] = useState<Milestone[]>([]);
  const [errors, setErrors] = useState<ErrorsObj>({});

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
    <motion.div
      className={cn("col-span-4", data.hidden && "hidden")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: id * 0.1 }}
    >
      <Card className="relative p-0 shadow-none">
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Remove entry"
          onClick={() => selectedData.project && handleRemove(selectedData.project?.id)}
          className="absolute -right-3 -top-3 h-6 w-6 rounded-full hover:text-destructive"
        >
          <X size={16} />
        </Button>
        <CardContent className="flex flex-col gap-3 p-4">
          <ComboBox
            searchable
            icon={<Folder size={16} />}
            options={projects}
            label="Select a Project"
            selectedItem={selectedData?.project}
            handleSelect={(selected) => dropdownSelectHandler(selected, projects, projectCallback)}
          />
          <ComboBox
            searchable
            icon={<Rocket size={16} />}
            options={projectMilestones}
            label="Select a Milestone"
            selectedItem={selectedData?.milestone}
            handleSelect={(selected) => dropdownSelectHandler(selected, projectMilestones, milestoneCallback)}
          />
          <ComboBox
            searchable
            icon={<List size={16} />}
            options={projectTasks}
            label="Select a Task"
            selectedItem={selectedData?.task}
            handleSelect={(selected) => dropdownSelectHandler(selected, projectTasks, taskCallback)}
          />
          <Input
            placeholder="Add a comment..."
            value={selectedData.comment ?? ""}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
              <Input
                type="text"
                placeholder="2:30"
                className={cn(
                  errors?.time
                    ? "border-destructive px-4 ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                    : "border-border focus:border-primary focus:ring-primary",
                  "placeholder:text-disabled-light h-9 w-[120px] select-none rounded-md border bg-transparent py-1 text-center text-sm leading-none transition-all duration-75 ease-out focus:outline-none",
                )}
                value={selectedData.time}
                onChange={(e) => handleLoggedTimeInput(e.currentTarget.value)}
              />
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
            </div>
            <Button
              type="button"
              size="icon"
              title="Submit entry"
              disabled={!formValidator()}
              onClick={(e) => handleSubmit(e, null, selectedData)}
            >
              <Check size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotepadCards;
