import React, { Dispatch, FormEvent, useEffect, useState } from "react";
import { CircleDollarSign, Folder, Check, List, X, Milestone as CategoryIcon } from "lucide-react";
import { motion } from "motion/react";

import { ComboBox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SelectedData } from "@/components/forms/timelogForm";

import { cn } from "@/lib/utils";
import { Project, Milestone } from "@/types";
import { Button } from "@/components/ui/button";
import { isCategoryRequired, isTaskRequired, isTimelogValid } from "@/lib/timelog-validation";

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
  allData,
  setAllData,
}: {
  projects: Project[];
  data: any;
  handleRemove: (id: string) => void;
  handleSubmit: (e: FormEvent, clearForm: Function | null, selectedData: SelectedData, isMultiple?: boolean) => void;
  id: number;
  allData: Project[];
  setAllData: Dispatch<React.SetStateAction<any>>;
}) => {
  const [selectedData, setSelectedData] = useState<SelectedData>(initialDataState);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [projectTasks, setprojectTasks] = useState<Milestone[]>([]);
  const [errors, setErrors] = useState<ErrorsObj>({});

  const formValidator = () =>
    isTimelogValid({
      ...selectedData,
      categories: projectMilestones,
      tasks: projectTasks,
      timeError: errors?.time,
    });

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
    const isDifferentProject = selected.id !== selectedData.project?.id;
    setSelectedData((prev) => ({
      ...prev,
      project: { id: selected.id, name: selected?.name, billable: selected?.billable },
      milestone: isDifferentProject ? null : prev.milestone,
      task: isDifferentProject ? null : prev.task,
      billable: selected?.billable ? true : false,
    }));
    setProjectMilestones(selected?.milestone ?? []);
    setprojectTasks(selected?.task ?? []);
  };

  const milestoneCallback = (selected: Milestone) => setSelectedData((prev) => ({ ...prev, milestone: selected }));

  const taskCallback = (selected: Milestone) => {
    const data: SelectedData = { ...selectedData, task: selected };
    setSelectedData(data);
  };

  const setCommentText = (str: string) => setSelectedData({ ...selectedData, comment: str });

  useEffect(() => {
    const foundProject = projects.find((project) => project.id === data.project?.id);
    setSelectedData({
      ...data,
      project: data.project
        ? { ...data.project, billable: data.project.billable ?? foundProject?.billable }
        : data.project,
    });
    setProjectMilestones(() => {
      const milestone = foundProject?.milestone;
      return milestone ? milestone : [];
    });
    setprojectTasks(() => {
      const task = foundProject?.task;
      return task ? task : [];
    });
  }, [data, projects]);

  useEffect(() => {
    const dataToUpdate = allData.map((item) => {
      if (item.uuid === selectedData.uuid) {
        return selectedData;
      }

      return item;
    });
    setAllData(dataToUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  const categoryRequired = isCategoryRequired(
    selectedData.project,
    projectMilestones,
    projectTasks,
    selectedData.milestone,
    selectedData.task,
  );
  const taskRequired = isTaskRequired(
    selectedData.project,
    projectTasks,
    projectMilestones,
    selectedData.milestone,
    selectedData.task,
  );

  return (
    <motion.div
      className="col-span-12 sm:col-span-6 lg:col-span-4"
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
          onClick={() => selectedData.project && handleRemove(selectedData.uuid ?? "")}
          className="absolute -right-3 -top-3 h-6 w-6 rounded-full hover:text-destructive"
          tabIndex={-1}
        >
          <X size={16} />
        </Button>
        <CardContent className="w-full-combo flex flex-col gap-3 p-4">
          <ComboBox
            searchable
            icon={<Folder size={16} />}
            options={projects}
            label="Project"
            selectedItem={selectedData?.project}
            handleSelect={(selected) => dropdownSelectHandler(selected, projects, projectCallback)}
            className="w-[90%] max-w-full"
          />
          {projectMilestones.length > 0 && (
            <ComboBox
              searchable
              icon={<CategoryIcon size={17} />}
              options={projectMilestones}
              label="Category"
              required={categoryRequired}
              selectedItem={selectedData?.milestone}
              handleSelect={(selected) => dropdownSelectHandler(selected, projectMilestones, milestoneCallback)}
              className="w-[90%] max-w-full"
            />
          )}
          {projectTasks.length > 0 && (
            <ComboBox
              searchable
              icon={<List size={16} />}
              options={projectTasks}
              label="Task"
              required={taskRequired}
              selectedItem={selectedData?.task}
              handleSelect={(selected) => dropdownSelectHandler(selected, projectTasks, taskCallback)}
              className="w-[90%] max-w-full"
            />
          )}
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
                  "placeholder:text-disabled-light h-9 w-[120px] select-none rounded-md border bg-transparent py-1 text-center text-sm leading-none transition-all duration-75 ease-out focus:outline-hidden",
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
                    !selectedData.billable && "text-muted-foreground hover:text-muted-foreground",
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
