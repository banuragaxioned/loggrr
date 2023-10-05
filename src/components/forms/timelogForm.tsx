import React, { Dispatch, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Command } from "cmdk";
import { Toggle } from "../ui/toggle";
import { ComboBox } from "../ui/combobox";
import { Project, Milestone } from "@/types";

interface TimelogProps {
  team: string;
  projects: Project[];
  submitCounter: Dispatch<(prev: number) => number>;
}

type SelectedData = {
  project?:Milestone;
  milestone?:Milestone;
  task?:Milestone;
}

interface ReferenceObject {
  tenant:string;
  project?:string;
  milestone?:string;
  task?:string;
}

//list item jsx
const renderList = (x: any) => {
  return (
    <>
      <span className="text-info-light dark:text-zinc-400">{x?.tenant}</span> / <span>{x?.project}</span> /{" "}
      <span>{x?.milestone}</span> / <span>{x?.task}</span>
    </>
  );
};

const getRecent = ()=> {
  const storage = localStorage.getItem('loggr-recent');
  return storage ? JSON.parse(storage) : [];
}

const setRecent = (arr:ReferenceObject[])=> localStorage.setItem('loggr-recent',JSON.stringify(arr))

export const TimeLogForm = ({ team, projects, submitCounter }: TimelogProps) => {
  const [search, setSearch] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>([]);
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [selectedTask, setSelectedTask] = useState<string | undefined>();
  const [isAllDropDownSelect, setAllDropDownSelect] = useState(false);
  const [filledData, setFilledData] = useState<any>();
  const [billable, setBillable] = useState(false);
  const [timeLogged, setTimeLogged] = useState<string>("");
  const [recentlyUsedArr, setRecentlyUsedArr] = useState<any>([]);
  const [canSubmit, setSubmit] = useState<boolean>(false);
  const [canClear, setClear] = useState<boolean>(false);
  const [commentFocus, setCommentFocus] = useState<boolean>(false);
  const [activeDropdown, setActiveDropDown] = useState<any>();
  const [projectErr, setProjectErr] = useState<boolean>(false);
  const [milestoneErr, setMilestoneErr] = useState<boolean>(false);
  const [taskErr, setTaskErr] = useState<boolean>(false);
  const [timeErr, setTimeErr] = useState<boolean>(false);
  const inputRef = useRef<any>();
  const inputParentRef = useRef<HTMLDivElement>(null);
  const checkobxRef = useRef<HTMLButtonElement | null>(null);
  const commentRef = useRef<any>();
  const commentParentRef = useRef<HTMLDivElement>(null);
  const timeLogFormRef = useRef<any>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  //my states
  const [selectedData,setSelectedData] = useState<SelectedData>();
  const [projectMilestone, setprojectmilestone] = useState<Milestone[]>([]);
  const [projectTask, setprojectTask] = useState<Milestone[]>([]);
  const [recentlyUsed,setRecentlyUsed] = useState<ReferenceObject[]>(getRecent());

  //list mapper
  const renderGroup = (arr: any) => {
    return arr?.map((x: any, i: any) => {
      return (
        <Command.Group
          key={i}
          heading={x.projectType}
          className="cmdk-group-heading:text-outline-dark select-none text-sm [&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:py-2"
        >
          {x.map((obj: any, innerI: any) => {
            return (
              <div key={innerI}>
                <Command.Item
                  className="w-full cursor-pointer px-5 py-2 aria-selected:bg-indigo-50 aria-selected:text-zinc-700 dark:aria-selected:bg-zinc-700 dark:aria-selected:text-zinc-900"
                  value={`${obj?.tenant} / ${obj?.projectName} / ${obj?.milestoneName} / ${obj?.taskName}`}
                  onSelect={() => isFocus && handleProjectSelect(obj)}
                >
                  {renderList(project)}
                </Command.Item>
              </div>
            );
          })}
        </Command.Group>
      );
    });
  };

  const handleClearForm = () => {
    setCommentText("");
    setFocus(false);
    setSelected(null);
    setSelectedTask(undefined);
    setTimeLogged("");
    setBillable(false);
    setActiveDropDown(undefined);
    if (!!checkobxRef.current) {
      checkobxRef.current.dataset.state = "off";
    }
  };

  //submit handler
  const handleSubmit = (e: any) => {
    if (!isFocus) {
      e.preventDefault();
      setProjectErr(filledData?.projectName?.length === 0);
      setMilestoneErr(filledData?.milestoneName?.length === 0);
      setTaskErr(filledData?.taskName?.length === 0);
      setTimeErr(filledData?.timeLogged.length === 0);

      if (canSubmit) {
        if (timeLogged.indexOf(":") === -1) {
          if (parseInt(timeLogged, 10) <= 12) setTimeLogged(timeLogged);
        } else if (timeLogged.indexOf(":") === 1) {
          const decimalResult = hoursToDecimal(timeLogged);
          if (decimalResult <= 12) setTimeLogged(decimalResult.toString());
        }
        handleClearForm();
      }
    }
  };

  //clear method
  const handleTimeLogCancel = () => {
    if (canClear) {
      setTimeErr(false);
      setProjectErr(false);
      setMilestoneErr(false);
      setTaskErr(false);
      handleClearForm();
    }
  };

  const handleLoggedTimeInput = (e: any) => {
    let time = e?.target?.value;
    setTimeErr(time.length === 0);
    const numberPattern = new RegExp(/[^0-9.:]/);
    if (!numberPattern.test(time) && time.length < 5) {
      if (time.indexOf(":") === -1 && time.indexOf(".") === -1) {
        if (time.length <= 2) setTimeLogged(time);
      } else {
        if (time.length <= 4) setTimeLogged(time);
      }
    }
  };

  const hoursToDecimal = (val: string) => {
    const arr = val.split(":");
    const result = parseInt(arr[0], 10) * 1 + parseInt(arr[1], 10) / 60;
    return result;
  };

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project?.projectName);
    // setSelectedMilestone(project?.milestoneName);
    setSelectedTask(project?.taskName);
  };

//project select handler callback
const projectCallback = (selected:Project)=>{
  setprojectmilestone((prev) => {
    const milestone = selected?.milestone;
    return milestone ? milestone : [];
  });
  setprojectTask((prev) => {
    const task = selected?.task;
    return task ? task : [];
  })
  setSelectedData({project:{id:selected.id,name:selected?.name}})
}

//milestone select handler callback
const milestoneCallback = (selected:Milestone)=>setSelectedData((prev)=>({...prev,milestone:selected}));

//task callback
const taskCallback = (selected:Milestone)=> {
  const data:SelectedData = {...selectedData,task:selected}
  setSelectedData(data);
  const selectedObj = {tenant:team,project:data?.project?.name,milestone:data?.milestone?.name,task:data?.task?.name};
  const arr = recentlyUsed.length < 2 ? [selectedObj,...recentlyUsed] : [selectedObj,...recentlyUsed.slice(0,1)];
  setRecentlyUsed(arr);  
  setRecent(arr);
};

//common select handler
const selectHandler = (name:string,arr:Milestone[],callback:(selected:Milestone|Project)=>void) =>{
  const selected = arr.filter((obj) => obj.name.toLocaleLowerCase() === name.toLocaleLowerCase())[0];
  callback(selected);
}

  //search focus handler
  const openSearch = () => {
    inputRef.current?.focus();
    setFocus(true);
  };

  return (
    <div
      ref={timeLogFormRef}
      className={`${
        isFocus
          ? "border-brand-light ring-brand-light shadow-lg ring-1 ring-offset-0"
          : "border-borderColor-light dark:border-borderColor-dark"
      } border-box z-[3] mx-auto my-5 w-full rounded-xl border bg-white dark:bg-transparent`}
    >
      <form onSubmit={(e) => handleSubmit(e)} onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}>
        <Command label="Command Menu" className="text-content-light relative">
          <div
            className={`${
              commentFocus
                ? "ring-brand-light rounded-b-sm border-white ring-2 ring-offset-0 dark:border-transparent"
                : "border-b-borderColor-light dark:border-b-borderColor-dark"
            } flex items-center rounded-t-xl border-b px-[18px] py-[7px]`}
          >
            {isAllDropDownSelect ? (
              <div ref={commentParentRef} className="flex basis-[70%] items-center">
                <Icons.comment
                  onClick={() => setCommentFocus(true)}
                  className="text-info-light h-[18px] w-[18px] shrink-0 stroke-2"
                />
                <input
                  tabIndex={5}
                  ref={commentRef}
                  className="placeholder:text-info-light peer-focus:bg-background-dark w-full select-none border-0 bg-transparent px-2 text-sm focus:outline-0 focus:ring-0"
                  placeholder="Add comment about what you..."
                  value={commentText}
                  onChange={(e: any) => setCommentText(e.target.value)}
                  onFocus={() => setCommentFocus(true)}
                  onBlur={() => setCommentFocus(false)}
                />
              </div>
            ) : (
              <div ref={inputParentRef} className="flex basis-[70%] items-center">
                <Icons.search onClick={openSearch} className="text-info-light h-[18px] w-[18px] shrink-0 stroke-2" />
                <Command.Input
                  tabIndex={1}
                  ref={inputRef}
                  className="placeholder:text-info-light peer-focus:bg-background-dark w-full select-none border-0 bg-transparent px-2 text-sm focus:outline-0 focus:ring-0"
                  placeholder="Select or start typing"
                  onFocus={() => setFocus(true)}
                  onClick={(e) => e.stopPropagation()}
                  value={search}
                  onValueChange={setSearch}
                />
              </div>
            )}
            <input
              tabIndex={6}
              type="text"
              placeholder="7:30"
              className={`${
                timeErr
                  ? "border-danger-light ring-danger-light focus:border-danger-light focus:ring-danger-light ring-1"
                  : "border-borderColor-light focus:border-brand-light focus:ring-brand-light dark:border-borderColor-dark"
              } placeholder:text-disabled-light w-[60px] select-none rounded-md border text-center text-sm leading-none transition-all duration-75 ease-out focus:outline-none focus:ring-1 focus:ring-offset-0 dark:bg-transparent`}
              value={timeLogged}
              onChangeCapture={handleLoggedTimeInput}
            />
            <Toggle
              tabIndex={7}
              ref={checkobxRef}
              variant="outline"
              size="sm"
              className="border-borderColor-light focus:border-brand-light focus:ring-brand-light data-[state=on]:text-billable-light dark:border-borderColor-dark ml-3 px-1.5 hover:bg-transparent focus:ring-1 focus:ring-offset-0 data-[state=on]:bg-transparent"
            >
              <Icons.dollar className="h-6 w-6" />
            </Toggle>
            <Button
              variant="secondary"
              size="sm"
              type="submit"
              disabled={!canSubmit}
              tabIndex={canSubmit ? 8 : -1}
              className={`border-brand-light bg-brand-light disabled:hover:bg-brand-light ml-[12px] border px-[12px] py-[7px] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Submit
            </Button>
          </div>
          <Command.List
            className={`w-[calc(100%)] ${
              isFocus ? "border-brand-light" : "border-borderColor-light dark:border-borderColor-dark"
            } text-content-light overflow-y-hidden bg-white transition-all duration-200 ease-in hover:overflow-y-auto dark:bg-transparent ${
              isFocus ? "max-h-[146px]" : "max-h-[0]"
            }`}
          >
            <Command.Empty className="inline-flex items-center gap-2 p-[12px] text-sm">No results found.</Command.Empty>
            {search?.length > 0 ? renderGroup(recentlyUsed) : renderGroup(recentlyUsedArr)}
          </Command.List>
        </Command>
      </form>

      <div
        className={`${
          isFocus
            ? "border-brand-light border-t-borderColor-light dark:border-t-borderColor-dark border-t "
            : "border-borderColor-light dark:border-borderColor-dark border-t-0"
        } bg-info-dark flex items-center justify-between rounded-b-xl px-5 py-[10px] dark:bg-zinc-900`}
      >
        <div ref={dropdownRef} className="inline-flex items-center gap-x-2.5 text-xs">
          {/* drop down */}
          <ComboBox
            tabIndex={2}
            searchable
            icon={<Icons.project className={`h-4 w-4`} />}
            options={projects}
            label={selectedData?.project?.name || "Project"}
            selectedItem={selectedData?.project?.name}
            handleSelect={(option)=>selectHandler(option,projects,projectCallback)}
          />
          <ComboBox
            tabIndex={3}
            searchable
            icon={<Icons.milestone className={`h-4 w-4`} />}
            options={projectMilestone}
            label={selectedData?.project?.name || "Milestone"}
            selectedItem={selectedData?.milestone?.name}
            handleSelect={(option) => selectHandler(option,projectMilestone,milestoneCallback)}
            disable={!selectedData?.project?.id}
          />
          {
            <ComboBox
              tabIndex={4}
              searchable
              icon={<Icons.task className={`h-4 w-4`} />}
              options={projectTask}
              label={selectedData?.task?.name || "Task"}
              selectedItem={selectedData?.task?.name}
              handleSelect={(option: string) => selectHandler(option,projectTask,taskCallback)}
              disable={!(selectedData?.project?.id && selectedData?.milestone?.id)}
            />
          }
        </div>
        {canClear && (
          <Button
            tabIndex={9}
            variant="primary"
            onClick={handleTimeLogCancel}
            size="sm"
            type="button"
            disabled={!canClear}
            className={`border-borderColor-light bg-background-light text-content-light hover:border-info-light focus:border-brand-light focus:ring-brand-light dark:border-borderColor-dark border px-[12px] py-[7px] text-xs leading-none focus:ring-1 dark:bg-transparent`}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};
