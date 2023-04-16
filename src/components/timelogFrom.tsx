import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icons } from "../components/icons";

import { Button } from "./ui/button";

// static data
import { clients } from "../utils/tempData";

import { Command } from "cmdk";
import Dropdown from "./ui/combobox";
import { Toggle } from "./ui/toggle";

type FormData = {
  project: string | undefined;
  milestone: string | undefined;
  task: string | undefined;
  loggedHours: number | undefined;
  isBillable: boolean;
};
type Props = {
  formData: FormData | undefined;
  handleFormData: (data: FormData) => void;
};

const TimeLogForm = ({ formData, handleFormData }: Props) => {
  const [search, setSearch] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);
  const [myProject, setMyProject] = useState<any>([]);
  const [orgProject, setOrgProject] = useState<any>([]);
  const [allProjects, setAllProjects] = useState<any>([]);
  const [projectArr, setProjectArr] = useState<any>([]);
  const [projectList, setProjectList] = useState<any>([]);
  const [milestoneList, setMilestoneList] = useState<any>([]);
  const [taskList, setTaskList] = useState<any>([]);
  const [selected, setSelected] = useState<any>([]);
  const [selectedProject, setSelectedProject] = useState<string | undefined>();
  const [selectedMilestone, setSelectedMilestone] = useState<string | undefined>();
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

  const userId = 12;
  const inputRef = useRef<any>();
  const inputParentRef = useRef<HTMLDivElement>(null);
  const checkobxRef = useRef<HTMLButtonElement | null>(null);
  const commentRef = useRef<any>();
  const commentParentRef = useRef<HTMLDivElement>(null);
  const timeLogFormRef = useRef<any>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tempArr: any = [];

    clients.forEach((client) => {
      const clientName = client.clientName;
      client.projects.forEach((project) => {
        const projectName = project.title;
        const membersId = project?.members?.map((x) => x.id);
        project.milestone.forEach((mlt) => {
          const milestoneName = mlt.title;
          project.tasks.forEach((task) => {
            if (task.milestoneId === mlt.id) {
              const taskName = task.title;
              const projectDetails = {
                clientName,
                projectName,
                milestoneName,
                taskName,
                membersId,
              };
              tempArr.push(projectDetails);
            }
          });
        });
      });
    });
    setAllProjects(tempArr);
  }, []);

  useEffect(() => {
    let tempRecentlyUsedArr: Array<any> = [];
    allProjects?.map((arr: any, i: number) => {
      const projectDetails = {
        clientName: arr.clientName,
        projectName: arr.projectName,
        milestoneName: arr.milestoneName,
        taskName: arr.taskName,
      };

      if (i < 3) tempRecentlyUsedArr.push(projectDetails);

      const isMember = arr?.membersId?.findIndex((x: any) => x === userId) !== -1;
      if (isMember) {
        setMyProject((prev: Array<any>) => [...prev, projectDetails]);
      } else {
        setOrgProject((prev: Array<any>) => [...prev, projectDetails]);
      }
    });
    setRecentlyUsedArr([
      {
        projectType: "Recently used",
        projectList: tempRecentlyUsedArr,
      },
    ]);
  }, [allProjects]);

  useEffect(() => {
    const tempMyProjectList: any = [];
    const tempOrgWideProjectList: any = [];

    myProject.map((project: any) => {
      !tempMyProjectList.includes(project.projectName) && tempMyProjectList.push(project.projectName);
    });

    orgProject.map((project: any) => {
      !tempOrgWideProjectList.includes(project.projectName) && tempOrgWideProjectList.push(project.projectName);
    });

    setProjectList([
      {
        groupHeading: "My Projects",
        group: tempMyProjectList,
      },
      {
        groupHeading: "Org Wide Projects",
        group: tempOrgWideProjectList,
      },
    ]);

    setProjectArr([
      {
        projectType: "My Project",
        projectList: myProject,
      },
      {
        projectType: "Org Wide Project",
        projectList: orgProject,
      },
    ]);
  }, [myProject, orgProject]);

  useEffect(() => {
    clients?.map((client: any) => {
      client?.projects?.map((project: any) => {
        if (selectedProject?.toLowerCase() === project?.title?.toLowerCase()) {
          setMilestoneList([
            {
              group: project?.milestone?.map((x: any) => x?.title),
            },
          ]);
          let mltId: string;
          project?.milestone?.map((mlt: any) => {
            if (mlt?.title?.toLowerCase() === selectedMilestone?.toLowerCase()) mltId = mlt.id;
          });
          let tempTaskList: any = [];
          project?.tasks?.map((tsk: any) => {
            if (mltId === tsk.milestoneId) {
              !tempTaskList.includes(tsk?.title) && tempTaskList.push(tsk?.title);
              setTaskList([
                {
                  group: tempTaskList,
                },
              ]);
            }
          });
        }
      });
    });
  }, [selectedProject, selectedMilestone]);

  useEffect(() => {
    if (selected) {
      setSearch("");
      inputRef.current?.blur();
      setFocus(false);
    }

    if (selected?.projectName && selected?.milestoneName && selected?.taskName && selected) {
      console.log(selected);
      setAllDropDownSelect(true);
      commentRef?.current?.focus();
    } else {
      setCommentFocus(false);
      setAllDropDownSelect(false);
    }
  }, [selected]);

  useEffect(() => {
    setFilledData({
      ...selected,
      timeLogged: timeLogged,
      billable,
      comment: commentText,
    });
  }, [selected, timeLogged, billable, commentText]);

  useEffect(() => {
    setSelected({ projectName: selectedProject, milestoneName: selectedMilestone, taskName: selectedTask });
  }, [selectedProject, selectedMilestone, selectedTask]);

  useEffect(() => {
    setProjectErr((prev: boolean) => prev && !!selectedProject);
  }, [selectedProject]);

  useEffect(() => {
    setMilestoneErr((prev: boolean) => prev && !!selectedMilestone);
  }, [selectedMilestone]);

  useEffect(() => {
    setTaskErr((prev: boolean) => prev && !!selectedTask);
  }, [selectedTask]);

  useEffect(() => {
    if (filledData) {
      setClear(
        (filledData?.projectName ||
          filledData?.milestoneName ||
          filledData?.taskName ||
          filledData?.timeLogged.length !== 0 ||
          filledData?.comment?.length > 0) &&
          selected
      );
      setSubmit(
        filledData?.projectName &&
          filledData?.milestoneName &&
          filledData?.taskName &&
          filledData?.timeLogged.length !== 0
      );
    }
  }, [filledData, selected]);

  const renderList = (x: any) => {
    return (
      <>
        <span className="text-info-light dark:text-zinc-400">{x?.clientName}</span> / <span>{x?.projectName}</span> /{" "}
        <span>{x?.milestoneName}</span> / <span>{x?.taskName}</span>
      </>
    );
  };

  const renderGroup = (arr: any) => {
    return arr?.map((x: any, i: any) => {
      return (
        <Command.Group
          key={i}
          heading={x.projectType}
          className="cmdk-group-heading:text-outline-dark select-none text-sm [&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:py-2"
        >
          {x.projectList.map((project: any, innerI: any) => {
            return (
              <div key={innerI}>
                <Command.Item
                  className="w-full cursor-pointer px-5 py-2 aria-selected:bg-indigo-50 aria-selected:text-slate-700 dark:aria-selected:bg-zinc-700 dark:aria-selected:text-slate-900"
                  value={`${project?.clientName} / ${project?.projectName} / ${project?.milestoneName} / ${project?.taskName}`}
                  onSelect={() => isFocus && handleProjectSelect(project)}
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
    setSelectedMilestone(undefined);
    setSelectedProject(undefined);
    setSelectedTask(undefined);
    setTimeLogged("");
    setBillable(false);
    setActiveDropDown(undefined);
    if (!!checkobxRef.current) {
      checkobxRef.current.dataset.state = "off";
    }
  };

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
        handleFormData({
          project: selectedProject,
          milestone: selectedMilestone,
          task: selectedTask,
          loggedHours: Number(timeLogged),
          isBillable: billable,
        });
        console.log(filledData);
      }
    }
  };

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
    setSelectedMilestone(project?.milestoneName);
    setSelectedTask(project?.taskName);
  };

  const handleSelectedProject = useCallback(
    (value: string) => {
      setSelectedProject(value);
      setSelectedMilestone((prev) => {
        if (milestoneList.indexOf(prev) === -1) return "";
      });
      setSelectedTask((prev) => {
        if (taskList.indexOf(prev) === -1) return "";
      });
    },
    [milestoneList, taskList]
  );

  const openSearch = () => {
    inputRef.current?.focus();
    setFocus(true);
  };

  const handleFocus = useCallback(
    (e: any) => {
      if (
        !(
          inputParentRef.current?.contains(e.target) ||
          activeDropdown?.current?.contains(e.target) ||
          dropdownRef?.current?.contains(e.target)
        )
      )
        setFocus(false);
    },
    [activeDropdown, dropdownRef]
  );

  useEffect(() => {
    document.addEventListener("click", handleFocus);
    return () => {
      document.removeEventListener("click", handleFocus);
    };
  }, [isFocus, handleFocus]);

  return (
    <div
      ref={timeLogFormRef}
      className={`${
        isFocus
          ? "border-brand-light shadow-lg ring-1 ring-brand-light ring-offset-0"
          : "border-borderColor-light dark:border-borderColor-dark"
      } border-box z-[3] mx-auto my-5 w-[690px] rounded-xl border bg-white dark:bg-transparent`}
    >
      <form onSubmit={(e) => handleSubmit(e)} onKeyDown={(e) => e.keyCode === 13 && handleSubmit(e)}>
        <Command label="Command Menu" className="relative text-content-light">
          <div
            className={`${
              commentFocus
                ? "rounded-b-sm border-white ring-2 ring-brand-light ring-offset-0 dark:border-transparent"
                : "border-b-borderColor-light dark:border-b-borderColor-dark"
            } flex items-center rounded-t-xl border-b px-[18px] py-[7px]`}
          >
            {isAllDropDownSelect ? (
              <div ref={commentParentRef} className="flex basis-[70%] items-center">
                <Icons.comment
                  onClick={() => setCommentFocus(true)}
                  className="h-[18px] w-[18px] shrink-0 stroke-2 text-info-light"
                />
                <input
                  tabIndex={5}
                  ref={commentRef}
                  className="w-full select-none border-0 bg-transparent px-2 text-sm placeholder:text-info-light focus:outline-0 focus:ring-0 peer-focus:bg-background-dark"
                  placeholder="Add comment about what you..."
                  value={commentText}
                  onChange={(e: any) => setCommentText(e.target.value)}
                  onFocus={() => setCommentFocus(true)}
                  onBlur={() => setCommentFocus(false)}
                />
              </div>
            ) : (
              <div ref={inputParentRef} className="flex basis-[70%] items-center">
                <Icons.search onClick={openSearch} className="h-[18px] w-[18px] shrink-0 stroke-2 text-info-light" />
                <Command.Input
                  tabIndex={1}
                  ref={inputRef}
                  className="w-full select-none border-0 bg-transparent px-2 text-sm placeholder:text-info-light focus:outline-0 focus:ring-0 peer-focus:bg-background-dark"
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
                  ? "border-danger-light ring-1 ring-danger-light focus:border-danger-light focus:ring-danger-light"
                  : "border-borderColor-light focus:border-brand-light focus:ring-brand-light dark:border-borderColor-dark"
              } w-[60px] select-none rounded-md border text-center text-sm leading-none transition-all duration-75 ease-out placeholder:text-disabled-light focus:outline-none focus:ring-1 focus:ring-offset-0 dark:bg-transparent`}
              value={timeLogged}
              onChangeCapture={handleLoggedTimeInput}
            />
            <Toggle
              tabIndex={7}
              ref={checkobxRef}
              variant="outline"
              size="sm"
              className="ml-3 border-borderColor-light px-1.5 hover:bg-transparent focus:border-brand-light focus:ring-1 focus:ring-brand-light focus:ring-offset-0 data-[state=on]:bg-transparent data-[state=on]:text-billable-light dark:border-borderColor-dark"
            >
              <Icons.dollar className="h-6 w-6" />
            </Toggle>
            <Button
              variant="default"
              size="sm"
              type="submit"
              disabled={!canSubmit}
              tabIndex={canSubmit ? 8 : -1}
              className={`ml-[12px] border border-brand-light bg-brand-light px-[12px] py-[7px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-light`}
            >
              Submit
            </Button>
          </div>
          <Command.List
            className={`w-[calc(100%)] ${
              isFocus ? "border-brand-light" : "border-borderColor-light dark:border-borderColor-dark"
            } overflow-y-hidden bg-white text-content-light transition-all duration-200 ease-in hover:overflow-y-auto dark:bg-transparent ${
              isFocus ? "max-h-[146px]" : "max-h-[0]"
            }`}
          >
            <Command.Empty className="inline-flex items-center gap-2 p-[12px] text-sm">No results found.</Command.Empty>
            {search?.length > 0 ? renderGroup(projectArr) : renderGroup(recentlyUsedArr)}
          </Command.List>
        </Command>
      </form>

      <div
        className={`${
          isFocus
            ? "border-t border-brand-light border-t-borderColor-light dark:border-t-borderColor-dark "
            : "border-t-0 border-borderColor-light dark:border-borderColor-dark"
        } flex items-center justify-between rounded-b-xl bg-info-dark px-5 py-[10px] dark:bg-zinc-900`}
      >
        <div ref={dropdownRef} className="inline-flex items-center gap-x-2.5 text-xs">
          <Dropdown
            tabIndex={2}
            group
            icon={<Icons.project className={`h-4 w-4`} />}
            label="Project"
            options={projectList}
            searchable
            onSelected={(option: string) => handleSelectedProject(option)}
            defaultValue={selectedProject}
          />
          <Dropdown
            tabIndex={3}
            icon={<Icons.milestone className={`h-4 w-4`} />}
            label="Milestone"
            options={milestoneList}
            searchable
            onSelected={(option: string) => setSelectedMilestone(option)}
            defaultValue={selectedMilestone}
            disable={!selectedProject}
            autoOpen={!!(selectedProject && !selectedMilestone)}
          />
          <Dropdown
            tabIndex={4}
            icon={<Icons.task className={`h-4 w-4`} />}
            label="Task"
            options={taskList}
            searchable
            onSelected={(option: string) => setSelectedTask(option)}
            defaultValue={selectedTask}
            disable={!(selectedProject && selectedMilestone)}
            autoOpen={!!(selectedProject && selectedMilestone && !selectedTask)}
          />
        </div>
        {canClear && (
          <Button
            tabIndex={9}
            variant="outline"
            onClick={handleTimeLogCancel}
            size="sm"
            type="button"
            disabled={!canClear}
            className={`border border-borderColor-light bg-background-light px-[12px] py-[7px] text-xs leading-none text-content-light hover:border-info-light focus:border-brand-light focus:ring-1 focus:ring-brand-light dark:border-borderColor-dark dark:bg-transparent`}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimeLogForm;
