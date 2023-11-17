import React, { Dispatch, FormEvent, useEffect, useRef, useState } from "react";
import { CircleDollarSign, Folder, List, MessageSquare, Rocket, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command } from "cmdk";
import { Toggle } from "../ui/toggle";
import { ComboBox } from "../ui/combobox";
import { Project, Milestone } from "@/types";
import { EditReferenceObj } from "../time-entry";

export type SelectedData = {
  client?: Milestone;
  project?: Project;
  milestone?: Milestone | null;
  task?: Milestone | null;
  comment?: string | null;
  time?: string;
  billable?: boolean;
};

interface TimelogProps {
  team: string;
  projects: Project[];
  date: Date;
  edit: EditReferenceObj;
  setEdit: Dispatch<EditReferenceObj>;
  submitHandler: (e: FormEvent, clearForm: Function, recentlyUsed: SelectedData[], selectedData?: SelectedData) => void;
}

type ErrorsObj = {
  time?: boolean;
};

//list item jsx
const renderList = (obj: SelectedData) => {
  return (
    obj.project &&
    obj.client && (
      <span className="text-info-light dark:text-zinc-400">{`${obj.client.name} / ${obj.project.name} ${
        obj.milestone?.name ? `/${obj.milestone.name}` : ""
      } ${obj.task?.name ? `/${obj.task?.name}` : ""} `}</span>
    )
  );
};

const getRecent = () => {
  const storage = localStorage.getItem("loggr-recent");
  return storage ? JSON.parse(storage) : [];
};

export const TimeLogForm = ({ projects, edit, submitHandler }: TimelogProps) => {
  const [isFocus, setFocus] = useState<boolean>(false);
  const [commentFocus, setCommentFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const checkobxRef = useRef<HTMLButtonElement>(null);
  const commentRef = useRef<HTMLInputElement>(null);
  const commentParentRef = useRef<HTMLDivElement>(null);
  const timeLogFormRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  //my states
  const [selectedData, setSelectedData] = useState<SelectedData>({});
  const [projectMilestone, setprojectmilestone] = useState<Milestone[]>([]);
  const [projectTask, setprojectTask] = useState<Milestone[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<SelectedData[]>([]);
  const [suggestions, setSuggestions] = useState<SelectedData[]>([]);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<ErrorsObj>({});

  //list mapper
  const renderGroup = (arr: SelectedData[]) => {
    return arr?.map((obj, i: number) => {
      return (
        obj.project &&
        obj.client && (
          <Command.Group
            key={i}
            className="cmdk-group-heading:text-outline-dark select-none text-sm [&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:py-2"
          >
            {
              <div key={i}>
                <Command.Item
                  className="group w-full cursor-pointer px-5 py-2 aria-selected:bg-indigo-50 aria-selected:text-zinc-700 dark:aria-selected:bg-zinc-700 dark:aria-selected:text-zinc-900"
                  value={`${obj.client.name} / ${obj.project.name} ${obj.milestone?.name ? `/${obj.milestone.name}` : ""} ${
                    obj.task?.name ? `/${obj.task?.name}` : ""
                  } `}
                  onSelect={() => {
                    setSelectedData(obj);
                    setFocus(false);
                  }}
                >
                  {renderList(obj)}
                </Command.Item>
              </div>
            }
          </Command.Group>
        )
      );
    });
  };

  const handleClearForm = () => {
    setSelectedData({});
    if (timeInputRef.current) timeInputRef.current.value = "";
    if (commentRef.current) commentRef.current.value = "";
    setRecentlyUsed(getRecent());
  };

  const formValidator = () => selectedData?.comment?.trim().length && selectedData?.time && selectedData?.project && !errors?.time;

  const handleLoggedTimeInput = (time: string) => {
    const numberPattern = new RegExp(/^([1-9]\d*(\.|\:)\d{0,2}|0?(\.|\:)\d*[1-9]\d{0,2}|[1-9]\d{0,2})$/, "g");
    numberPattern.test(time) ? setErrors({ ...errors, time: false }) : setErrors({ ...errors, time: true });
    setSelectedData({ ...selectedData, time: time });
  };

  //project select handler callback
  const projectCallback = (selected: Project) => {
    setprojectmilestone((prev) => {
      const milestone = selected?.milestone;
      return milestone ? milestone : [];
    });
    setprojectTask((prev) => {
      const task = selected?.task;
      return task ? task : [];
    });
    setSelectedData({
      ...selectedData,
      client: selected?.client,
      project: { id: selected.id, name: selected?.name, billable: selected?.billable },
    });
  };

  //milestone select handler callback
  const milestoneCallback = (selected: Milestone) => setSelectedData((prev) => ({ ...prev, milestone: selected }));

  //task callback
  const taskCallback = (selected: Milestone) => {
    const data: SelectedData = { ...selectedData, task: selected };
    setSelectedData(data);
    setFocus(false);
  };

  //common select handler
  const selectHandler = (name: string, arr: Milestone[], callback: Function) => {
    const selected = arr.filter((obj) => obj.name.toLocaleLowerCase() === name.toLocaleLowerCase())[0];
    callback(selected);
  };

  //search focus handler
  const openSearch = () => {
    inputRef.current?.focus();
    setFocus(true);
  };

  //set comment
  const setCommentText = (str: string) => setSelectedData({ ...selectedData, comment: str });

  const getFormattedSuggestion = (current: Project, milestone?: Milestone, task?: Milestone) => ({
    client: current?.client,
    project: { id: current?.id, name: current?.name, billable: current.billable },
    milestone: milestone,
    task: task,
  });

  const getCombination = (current: Project) => {
    const temp: SelectedData[] = [];
    current.milestone?.map((milestone) => {
      current?.task?.map((task) => temp.push(getFormattedSuggestion(current, milestone, task)));
    });
    return temp;
  };

  //search suggestion
  const setSearch = (str: string) => {
    const [clientName, projectName, milestoneName, taskName] = str.toLowerCase().trim().split("/");
    const suggestionArr2 = projects.reduce((prev: SelectedData[], current) => {
      const check1 = current.client?.name.toLowerCase().includes(clientName) ? current : null;
      const check2 = projectName ? (check1?.name.toLowerCase().includes(projectName) ? current : null) : current;
      const milestoneObj = check2?.milestone?.find((obj) => obj.name.toLowerCase().includes(milestoneName));
      const taskObj = milestoneObj && check2?.task?.find((obj) => obj.name.toLowerCase().includes(taskName));
      const [isTask, isMilestone] = [current.task, current.milestone];
      const check3 =
        check2 &&
        (milestoneName
          ? milestoneObj
            ? isTask?.length
              ? isTask.map((obj) => getFormattedSuggestion(current, milestoneObj, obj))
              : [getFormattedSuggestion(current, milestoneObj)]
            : null
          : isMilestone?.length
            ? isTask?.length
              ? getCombination(current)
              : isMilestone.map((obj) => getFormattedSuggestion(current, obj))
            : null);
      const check4 =
        check3 &&
        (taskName
          ? taskObj
            ? [getFormattedSuggestion(current, milestoneObj, taskObj)]
            : null
          : isTask?.length && milestoneObj
            ? isTask.map((obj) => getFormattedSuggestion(current, milestoneObj, obj))
            : check3);
      return check4 ? [...prev, ...check4] : prev;
    }, []);
    setSuggestions(suggestionArr2);
  };

  useEffect(() => {
    setRecentlyUsed(getRecent());
  }, []);

  useEffect(() => {
    edit.isEditing ? setSelectedData(edit.obj) : handleClearForm();
  }, [edit.isEditing]);

  return (
    <div
      ref={timeLogFormRef}
      className={`${
        isFocus ? "border-brand-light ring-brand-light shadow-lg ring-1 ring-offset-0" : "border-borderColor-light dark:border-borderColor-dark"
      } border-box z-[3] mx-auto my-5 w-full rounded-xl border bg-white dark:bg-transparent`}
    >
      <form
        onSubmit={(e) => submitHandler(e, handleClearForm, recentlyUsed, selectedData)}
        onKeyDown={(e) => e.key === "Enter" && formValidator() && submitHandler(e, handleClearForm, recentlyUsed, selectedData)}
      >
        <Command label="Command Menu" className="text-content-light relative">
          <div
            className={`${
              commentFocus
                ? "ring-brand-light rounded-b-sm border-white ring-2 ring-offset-0 dark:border-transparent"
                : "border-b-borderColor-light dark:border-b-borderColor-dark"
            } flex items-center justify-between rounded-t-xl border-b px-[18px] py-[7px]`}
          >
            {selectedData?.project ? (
              <div ref={commentParentRef} className="flex basis-[70%] items-center">
                <MessageSquare onClick={() => setCommentFocus(true)} className="text-info-light h-[18px] w-[18px] shrink-0 stroke-2" />
                <input
                  tabIndex={5}
                  ref={commentRef}
                  className="placeholder:text-info-light peer-focus:bg-background-dark w-full select-none border-0 bg-transparent px-2 text-sm focus:outline-0 focus:ring-0"
                  placeholder="Add comment about what you..."
                  value={selectedData?.comment ? selectedData.comment : ""}
                  onChange={(e) => setCommentText(e.target.value)}
                  onFocus={() => setCommentFocus(true)}
                  onBlur={() => setCommentFocus(false)}
                />
              </div>
            ) : (
              <div className="flex basis-[70%] items-center">
                <SearchIcon onClick={openSearch} className="text-info-light h-[18px] w-[18px] shrink-0 stroke-2" />
                <Command.Input
                  tabIndex={1}
                  ref={inputRef}
                  className="placeholder:text-info-light peer-focus:bg-background-dark w-full select-none border-0 bg-transparent px-2 text-sm focus:outline-0 focus:ring-0"
                  placeholder="Select or start typing"
                  onFocus={() => setFocus(true)}
                  onClick={(e) => e.stopPropagation()}
                  onValueChange={setSearch}
                  onBlur={(e) => {
                    e.target.value = "";
                    setTimeout(() => setFocus(false), 125);
                  }}
                />
              </div>
            )}
            <input
              tabIndex={6}
              type="text"
              placeholder="7:30"
              className={`${
                errors?.time
                  ? "border-destructive px-4 ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                  : "border-borderColor-light focus:border-brand-light focus:ring-brand-light dark:border-borderColor-dark"
              } placeholder:text-disabled-light w-[60px] select-none rounded-md border text-center text-sm leading-none transition-all duration-75 ease-out focus:outline-none dark:bg-transparent`}
              value={selectedData?.time}
              onChangeCapture={(e) => handleLoggedTimeInput(e.currentTarget.value)}
              ref={timeInputRef}
            />
            <Toggle
              tabIndex={7}
              ref={checkobxRef}
              variant="outline"
              size="sm"
              onClick={() => selectedData?.project?.billable && setSelectedData((prev) => ({ ...prev, billable: !selectedData?.billable }))}
              className={`border-borderColor-light ${selectedData?.project?.billable ? "" : "opacity-30"} ${
                selectedData?.billable ? "border-brand-light ring-brand-light ring-1 ring-offset-0" : ""
              } text-billable-light dark:border-borderColor-dark ml-3 px-1.5 `}
            >
              <CircleDollarSign className="h-6 w-6" />
            </Toggle>
            <Button
              variant="secondary"
              size="sm"
              type="submit"
              disabled={!formValidator()}
              tabIndex={selectedData?.comment && selectedData?.time && selectedData?.task ? 8 : -1}
              className={`disabled:hover:bg-brand-light ml-[12px] min-w-[75px] border px-[12px] py-[7px] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {edit.isEditing ? "Save" : "Submit"}
            </Button>
          </div>
          <Command.List
            className={`z-10 w-[calc(100%)] ${
              isFocus ? "border-brand-light" : "border-borderColor-light dark:border-borderColor-dark"
            } text-content-light overflow-y-hidden bg-white transition-all duration-200 ease-in hover:overflow-y-auto dark:bg-transparent ${
              isFocus ? "max-h-[146px]" : "max-h-[0]"
            }`}
          >
            {inputRef.current && inputRef.current?.value?.length < 1 && (
              <Command className="inline-flex items-center gap-2 p-[12px] text-sm">Recently Used :</Command>
            )}
            <Command.Empty className="inline-flex items-center gap-2 p-[12px] text-sm">No results found.</Command.Empty>
            {inputRef.current && inputRef.current?.value?.length > 0 ? renderGroup(suggestions) : renderGroup(recentlyUsed)}
          </Command.List>
        </Command>
      </form>

      <div
        className={`${
          isFocus
            ? "border-brand-light border-t-borderColor-light dark:border-t-borderColor-dark border-t"
            : "border-borderColor-light dark:border-borderColor-dark border-t-0"
        } bg-info-dark flex items-center justify-between rounded-b-xl px-5 py-[10px] dark:bg-zinc-900`}
      >
        <div ref={dropdownRef} className="inline-flex items-center gap-x-2.5 text-xs">
          {/* drop down */}
          <ComboBox
            tabIndex={2}
            searchable
            icon={<Folder className={`h-4 w-4`} />}
            options={projects}
            label={selectedData?.project?.name || "Project"}
            selectedItem={selectedData?.project?.name}
            handleSelect={(option) => selectHandler(option, projects, projectCallback)}
            disable={!selectedData?.client?.id}
          />
          <ComboBox
            tabIndex={3}
            searchable
            icon={<Rocket className={`h-4 w-4`} />}
            options={projectMilestone}
            label={selectedData?.milestone?.name || "Milestone"}
            selectedItem={selectedData?.milestone?.name}
            handleSelect={(option) => selectHandler(option, projectMilestone, milestoneCallback)}
            disable={!selectedData?.project?.id}
          />
          {
            <ComboBox
              tabIndex={4}
              searchable
              icon={<List className={`h-4 w-4`} />}
              options={projectTask}
              label={selectedData?.task?.name || "Task"}
              selectedItem={selectedData?.task?.name}
              handleSelect={(option: string) => selectHandler(option, projectTask, taskCallback)}
              disable={!(selectedData?.project?.id && selectedData?.milestone?.id) || !selectedData?.task?.id}
            />
          }
        </div>
        <Button
          tabIndex={9}
          variant="primary"
          onClick={handleClearForm}
          size="sm"
          type="submit"
          disabled={!(selectedData?.milestone || selectedData?.project || selectedData?.task)}
          className={`border-borderColor-light bg-background-light text-content-light hover:border-info-light focus:border-brand-light focus:ring-brand-light dark:border-borderColor-dark border px-[12px] py-[7px] text-xs leading-none focus:ring-1 dark:bg-transparent`}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
