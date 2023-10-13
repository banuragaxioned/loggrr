import React, { Dispatch, useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Command } from "cmdk";
import { Toggle } from "../ui/toggle";
import { ComboBox } from "../ui/combobox";
import { Project, Milestone } from "@/types";
import useToast from "@/hooks/useToast";

interface ProjectSummaryWithBillable extends Project {
  billable: boolean;
}
interface TimelogProps {
  team: string;
  projects: ProjectSummaryWithBillable[];
  submitCounter: Dispatch<(prev: number) => number>;
  date: Date;
}

interface ProjectWithBillable extends Milestone {
  billable?: boolean;
}

type SelectedData = {
  client?: Milestone;
  project?: ProjectWithBillable;
  milestone?: Milestone;
  task?: Milestone;
  comment?: string;
  time?: string;
  billable?: boolean;
};

//list item jsx
const renderList = (x: any) => {
  return (
    <>
      <span className="text-info-light dark:text-zinc-400">{x?.client.name}</span> / <span>{x?.project.name}</span> /{" "}
      <span>{x?.milestone.name}</span> / <span>{x?.task.name}</span>
    </>
  );
};

const getRecent = () => {
  const storage = localStorage.getItem("loggr-recent");
  return storage ? JSON.parse(storage) : [];
};

const setRecent = (arr: SelectedData[]) => localStorage.setItem("loggr-recent", JSON.stringify(arr));

export const TimeLogForm = ({ team, projects, submitCounter, date }: TimelogProps) => {
  const [isFocus, setFocus] = useState<boolean>(false);
  const [canClear, setClear] = useState<boolean>(false);
  const [commentFocus, setCommentFocus] = useState<boolean>(false);
  const [timeErr, setTimeErr] = useState<boolean>(false);
  const inputRef = useRef<any>();
  const inputParentRef = useRef<HTMLDivElement>(null);
  const checkobxRef = useRef<HTMLButtonElement | null>(null);
  const commentRef = useRef<any>();
  const commentParentRef = useRef<HTMLDivElement>(null);
  const timeLogFormRef = useRef<any>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const showToast = useToast();
  //my states
  const [selectedData, setSelectedData] = useState<SelectedData>();
  const [projectMilestone, setprojectmilestone] = useState<Milestone[]>([]);
  const [projectTask, setprojectTask] = useState<Milestone[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<SelectedData[]>([]);
  const [suggestions, setSuggestions] = useState<SelectedData[]>([]);
  const timeInputRef = useRef<any>();

  //list mapper
  const renderGroup = (arr: any) => {
    return arr?.map((obj: any, i: any) => {
      return (
        <Command.Group
          key={i}
          heading={obj.projectType}
          className="cmdk-group-heading:text-outline-dark select-none text-sm [&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:py-2"
        >
          {
            <div key={i}>
              <Command.Item
                className="w-full cursor-pointer px-5 py-2 aria-selected:bg-indigo-50 aria-selected:text-zinc-700 dark:aria-selected:bg-zinc-700 dark:aria-selected:text-zinc-900"
                value={`${obj?.client.name} / ${obj?.project.name} / ${obj?.milestone.name} / ${obj?.task.name}`}
                onSelect={() => {
                  isFocus && setSelectedData(obj);
                  setFocus(false);
                  setClear(true);
                }}
              >
                {renderList(obj)}
              </Command.Item>
            </div>
          }
        </Command.Group>
      );
    });
  };

  const handleClearForm = () => setSelectedData({});

  //submit handler 
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch("/api/team/time-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team,
        project: selectedData?.project?.id,
        milestone: selectedData?.milestone?.id,
        time: Number(selectedData?.time) * 100,
        comments: selectedData?.comment,
        billable: selectedData?.billable ? true : false,
        date:new Date(date)
      }),
    });
    if(response.ok ) {
      showToast("Time entry added", "success") ;
      submitCounter((prev)=>prev+1);
    }else showToast("Something went wrong,try again", "warning");
    handleClearForm();
  };

  const handleLoggedTimeInput = (time: string) => {
    const numberPattern = new RegExp(/[^0-9.:]/);
    if (!numberPattern.test(time) && time.length < 5) {
      if (time.indexOf(":") === -1 && time.indexOf(".") === -1) {
        if (time.length <= 2) setSelectedData((prev) => ({ ...prev, time: time }));
      } else {
        if (time.length <= 4) setSelectedData((prev) => ({ ...prev, time: time }));
      }
    }
  };

  // const hoursToDecimal = (val: string) => {
  //   const arr = val.split(":");
  //   const result = parseInt(arr[0], 10) * 1 + parseInt(arr[1], 10) / 60;
  //   return result;
  // };

  //project select handler callback
  const projectCallback = (selected:ProjectSummaryWithBillable) => {
    setprojectmilestone((prev) => {
      const milestone = selected?.milestone;
      return milestone ? milestone : [];
    });
    setprojectTask((prev) => {
      const task = selected?.task;
      return task ? task : [];
    });
    setSelectedData({
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
    const selectedObj = { client: data?.client, project: data?.project, milestone: data?.milestone, task: data?.task };
    const arr = recentlyUsed.length < 3 ? [selectedObj, ...recentlyUsed] : [selectedObj, ...recentlyUsed.slice(0, 1)];
    setRecentlyUsed(arr);
    setRecent(arr);
    setFocus(false);
    setClear(true);
  };

  //common select handler
  const selectHandler = (name: string, arr: Milestone[], callback: any) => {
    const selected = arr.filter((obj) => obj.name.toLocaleLowerCase() === name.toLocaleLowerCase())[0];
    callback(selected);
  };

  //search focus handler
  const openSearch = () => {
    inputRef.current?.focus();
    setFocus(true);
  };

  //set comment
  const setCommentText = (str: string) => setSelectedData((prev) => ({ ...prev, comment: str }));

  //search suggestion
  const setSearch = (str: string) => {
    const matchedArr = projects
      .filter((project) => project.client?.name.toLowerCase().includes(str.toLocaleLowerCase()))
      .map((project) => ({
        client: project?.client,
        project: { id: project?.id, name: project?.name, billable: project.billable },
        milestone: project?.milestone,
        task: project?.task,
      }));

    const suggestionArr = matchedArr.reduce((prev: SelectedData[], current) => {
      const temp: SelectedData[] = [];
      current.milestone?.map(
        (milestone) =>
          current.task?.map((task) =>
            temp.push({ client: current?.client, project: current.project, milestone, task }),
          ),
      );
      return [...prev, ...temp];
    }, []);
    setSuggestions(suggestionArr);
  };

  useEffect(()=>{
    setRecentlyUsed(getRecent())
  },[]);

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
            } flex items-center rounded-t-xl border-b px-[18px] py-[7px] justify-between`}
          >
            {selectedData?.milestone && selectedData?.project && selectedData?.task ? (
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
                  value={selectedData?.comment}
                  onChange={(e) => setCommentText(e.target.value)}
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
              value={selectedData?.time}
              onChangeCapture={(e) => handleLoggedTimeInput(e.currentTarget.value)}
              ref={timeInputRef}
            />
            <Toggle
              tabIndex={7}
              ref={checkobxRef}
              variant="outline"
              size="sm"
              onClick={() =>
                selectedData?.project?.billable &&
                setSelectedData((prev) => ({ ...prev, billable: !selectedData?.billable }))
              }
              className={`border-borderColor-light ${
                selectedData?.billable ? "border-brand-light ring-brand-light ring-1 ring-offset-0" : ""
              } text-billable-light dark:border-borderColor-dark ml-3 px-1.5 `}
            >
              <Icons.dollar className="h-6 w-6" />
            </Toggle>
            <Button
              variant="secondary"
              size="sm"
              type="submit"
              disabled={!(selectedData?.comment && selectedData?.time && selectedData?.task)}
              tabIndex={selectedData?.comment && selectedData?.time && selectedData?.task ? 8 : -1}
              className={`disabled:hover:bg-brand-light ml-[12px] border px-[12px] py-[7px] disabled:cursor-not-allowed disabled:opacity-50`}
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
            {/* <Command.Empty className="inline-flex items-center gap-2 p-[12px] text-sm">No results found.</Command.Empty> */}
            {inputRef?.current?.value.length > 0 ? renderGroup(suggestions) : renderGroup(recentlyUsed)}
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
            handleSelect={(option) => selectHandler(option, projects, projectCallback)}
            disable={!selectedData?.client?.id}
          />
          <ComboBox
            tabIndex={3}
            searchable
            icon={<Icons.milestone className={`h-4 w-4`} />}
            options={projectMilestone}
            label={selectedData?.project?.name || "Milestone"}
            selectedItem={selectedData?.milestone?.name}
            handleSelect={(option) => selectHandler(option, projectMilestone, milestoneCallback)}
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
              handleSelect={(option: string) => selectHandler(option, projectTask, taskCallback)}
              disable={!(selectedData?.project?.id && selectedData?.milestone?.id)}
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
