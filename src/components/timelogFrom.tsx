import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icons } from "../components/icons";

import { Button } from "./ui/button";

// static data
import { clients } from "../utils/tempData";

import { Command } from "cmdk";
import Dropdown from "./ui/combobox";
import Toggle from "./ui/toggle";

type FormData = {
  project: string | undefined,
  milestone: string | undefined,
  task: string | undefined,
  loggedHours: number | undefined,
  isBillable: boolean,
}
type Props = {
  formData: FormData | undefined,
  handleFormData: (data:FormData) => void
}

const TimeLogForm = ({formData, handleFormData} : Props) => {
  const [search, setSearch] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);
  const [myProject, setMyProject] = useState<any>([]);
  const [orgProject, setOrgProject] = useState<any>([]);
  const [allProjects, setAllProjects] = useState<any>([]);
  const [projectArr, setProjectArr] = useState<any>([]);
  const [projectList, setProjectList] = useState<any>([])
  const [milestoneList, setMilestoneList] = useState<any>([])
  const [taskList, setTaskList] = useState<any>([])
  const [selected, setSelected] = useState<any>([])
  const [selectedProject, setSelectedProject] = useState<string | undefined>()
  const [selectedMilestone, setSelectedMilestone] = useState<string | undefined>()
  const [selectedTask, setSelectedTask] = useState<string | undefined>()
  const [isAllDropDownSelect, setAllDropDownSelect] = useState(false)
  const [filledData, setFilledData] = useState<any>()
  const [billable, setBillable] = useState(false)
  const [timeLogged, setTimeLogged] = useState<string>('')
  const [recentlyUsedArr, setRecentlyUsedArr] = useState<any>([])
  const [canSubmit, setSubmit] = useState<boolean>(false)
  const [canClear, setClear] = useState<boolean>(false)
  const [commentFocus, setCommentFocus] = useState<boolean>(false)
  const [activeDropdown, setActiveDropDown] = useState<any>()
  const [projectErr, setProjectErr] = useState<boolean>(false)
  const [milestoneErr, setMilestoneErr] = useState<boolean>(false)
  const [taskErr, setTaskErr] = useState<boolean>(false)
  const [timeErr, setTimeErr] = useState<boolean>(false)

  const userId = 12;
  const inputRef = useRef<any>();
  const inputParentRef = useRef<HTMLDivElement>(null)
  const checkobxRef = useRef<HTMLInputElement | null>(null);
  const commentRef = useRef<any>();
  const commentParentRef = useRef<HTMLDivElement>(null)
  const timeLogFormRef = useRef<any>();
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    let tempRecentlyUsedArr: Array<any> = []
    allProjects?.map((arr: any, i: number) => {
      const projectDetails = {
        clientName: arr.clientName,
        projectName: arr.projectName,
        milestoneName: arr.milestoneName,
        taskName: arr.taskName,
      };

      if (i < 3) tempRecentlyUsedArr.push(projectDetails)

      const isMember =
        arr?.membersId?.findIndex((x: any) => x === userId) !== -1;
      if (isMember) {
        setMyProject((prev: Array<any>) => [...prev, projectDetails]);
      } else {
        setOrgProject((prev: Array<any>) => [...prev, projectDetails]);
      }
    });
    setRecentlyUsedArr([{
      projectType: 'Recently used',
      projectList: tempRecentlyUsedArr
    }])
  }, [allProjects]);

  useEffect(() => {
    const tempMyProjectList: any = []
    const tempOrgWideProjectList: any = []

    myProject.map((project: any) => {
      !tempMyProjectList.includes(project.projectName) && tempMyProjectList.push(project.projectName)
    })

    orgProject.map((project: any) => {
      !tempOrgWideProjectList.includes(project.projectName) && tempOrgWideProjectList.push(project.projectName)
    })

    setProjectList([
      {
        groupHeading: 'My Projects',
        group: tempMyProjectList
      },
      {
        groupHeading: 'Org Wide Projects',
        group: tempOrgWideProjectList
      }
    ])

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
          setMilestoneList([{
            group: project?.milestone?.map((x: any) => x?.title)
          }])
          let mltId: string;
          project?.milestone?.map((mlt: any) => {
            if (mlt?.title?.toLowerCase() === selectedMilestone?.toLowerCase()) mltId = mlt.id
          })
          let tempTaskList: any = []
          project?.tasks?.map((tsk: any) => {
            if (mltId === tsk.milestoneId) {
              !tempTaskList.includes(tsk?.title) && tempTaskList.push(tsk?.title)
              setTaskList([{
                group: tempTaskList
              }])
            }
          })
        }
      })
    })
  }, [selectedProject, selectedMilestone])


  useEffect(() => {
    if (selected) {
      setSearch("");
      inputRef.current?.blur();
      setFocus(false);
    }

    if (selected?.projectName && selected?.milestoneName && selected?.taskName && selected) {
      console.log(selected)
      setAllDropDownSelect(true)
      commentRef?.current?.focus()
    }
    else {
      setCommentFocus(false)
      setAllDropDownSelect(false)
    }
  }, [selected, commentRef.current]);

  useEffect(() => {
    setFilledData({
      ...selected,
      timeLogged: timeLogged,
      billable,
      comment: commentText
    })
  }, [selected, timeLogged, billable, commentText])

  useEffect(() => {
    setSelected({ projectName: selectedProject, milestoneName: selectedMilestone, taskName: selectedTask })
  }, [selectedProject, selectedMilestone, selectedTask])

  useEffect(() => {
    if (projectErr && selectedProject) setProjectErr(true)
    else setProjectErr(false)
  }, [selectedProject])

  useEffect(() => {
    if (milestoneErr && selectedMilestone) setMilestoneErr(true)
    else setMilestoneErr(false)
  }, [selectedMilestone])

  useEffect(() => {
    if (taskErr && selectedTask) setTaskErr(true)
    else setTaskErr(false)
  }, [selectedTask])

  useEffect(() => {
    if (filledData) {
      setClear((filledData?.projectName || filledData?.milestoneName || filledData?.taskName || filledData?.timeLogged.length !== 0 || filledData?.comment?.length > 0) && selected)
      setSubmit(filledData?.projectName && filledData?.milestoneName && filledData?.taskName && filledData?.timeLogged.length !== 0)
    }
  }, [filledData])

  const renderList = (x: any) => {
    return (
      <>
        <span className="text-info-light">{x?.clientName}</span> /{" "}
        <span>{x?.projectName}</span> / <span>{x?.milestoneName}</span> /{" "}
        <span>{x?.taskName}</span>
      </>
    );
  };

  const renderGroup = (arr: any) => {
    return (
      arr?.map((x: any, i: any) => {
        return (
          <Command.Group
            key={i}
            heading={x.projectType}
            className="cmdk-group-heading:text-outline-dark text-sm [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:px-5 select-none"
          >
            {x.projectList.map((project: any, innerI: any) => {
              return (
                <div key={innerI}>
                  <Command.Item
                    className="aria-selected:bg-indigo-50 aria-selected:text-slate-700 cursor-pointer w-full py-2 px-5"
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
      })
    )
  }

  const handleClearForm = () => {
    setCommentText('')
    setFocus(false);
    setSelected(null);
    setSelectedMilestone(undefined)
    setSelectedProject(undefined)
    setSelectedTask(undefined)
    setTimeLogged('')
    setBillable(false)
    setActiveDropDown(undefined)
    if(!!checkobxRef.current) {
      checkobxRef.current.checked = false
    }
  }

  const handleSubmit = (e: any) => {
    if (!isFocus) {
      e.preventDefault();
      setProjectErr(filledData?.projectName?.length === 0)
      setMilestoneErr(filledData?.milestoneName?.length === 0)
      setTaskErr(filledData?.taskName?.length === 0)
      setTimeErr(filledData?.timeLogged.length === 0)

      if (canSubmit) {
        if (timeLogged.indexOf(':') === -1) {
          if (parseInt(timeLogged, 10) <= 12) setTimeLogged(timeLogged)
        } else if (timeLogged.indexOf(':') === 1) {
          const decimalResult = hoursToDecimal(timeLogged)
          if (decimalResult <= 12) setTimeLogged(decimalResult.toString())
        }
        handleClearForm()
        handleFormData({
          project: selectedProject,
          milestone: selectedMilestone,
          task: selectedTask,
          loggedHours: Number(timeLogged),
          isBillable: billable
        })
        console.log(filledData)
      }
    }
  }

  const handleTimeLogCancel = () => {
    if (canClear) {
      setTimeErr(false)
      setProjectErr(false)
      setMilestoneErr(false)
      setTaskErr(false)
      handleClearForm()
    }
  }

  const handleLoggedTimeInput = (e: any) => {
    let time = e?.target?.value
    setTimeErr(time.length === 0)
    const numberPattern = new RegExp(/[^0-9.:]/);
    if (!numberPattern.test(time) && time.length < 5) {
      if (time.indexOf(':') === -1 && time.indexOf('.') === -1) {
        if (time.length <= 2) setTimeLogged(time)
      } else {
        if (time.length <= 4) setTimeLogged(time)
      }
    }
  }

  const hoursToDecimal = (val: string) => {
    const arr = val.split(':');
    const result = parseInt(arr[0], 10) * 1 + parseInt(arr[1], 10) / 60;
    return result;
  };

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project?.projectName)
    setSelectedMilestone(project?.milestoneName)
    setSelectedTask(project?.taskName)
  }

  const handleSelectedProject = useCallback((value: string) => {
    setSelectedProject(value)
    if (milestoneList.indexOf(selectedMilestone) === -1) setSelectedMilestone('')
    if (taskList.indexOf(selectedTask) === -1) setSelectedTask('')
  }, [milestoneList, taskList])

  const openSearch = () => {
    inputRef.current?.focus();
    setFocus(true)
  }

  const handleFocus = useCallback((e: any) => {
    if (!(inputParentRef.current?.contains(e.target) || activeDropdown?.current?.contains(e.target) || dropdownRef?.current?.contains(e.target))) setFocus(false)
  }, [activeDropdown, dropdownRef])

  useEffect(() => {
    document.addEventListener('click', handleFocus)
    return () => {
      document.removeEventListener('click', handleFocus)
    }
  }, [isFocus])

  return (
    <div ref={timeLogFormRef} className={`${isFocus ? 'ring-1 ring-brand-light ring-offset-0 shadow-lg border-brand-light' : 'border-borderColor-light'} bg-white border z-[3] border-box my-5 mx-auto rounded-xl w-[690px]`}>
      <form onSubmit={(e) => handleSubmit(e)} onKeyDown={(e) => e.keyCode === 13 && handleSubmit(e)}>
        <Command
          label="Command Menu"
          className="relative text-content-light"
        >
          <div className={`${commentFocus ? 'ring-2 ring-brand-light ring-offset-0 rounded-b-sm border-white' : 'border-b-borderColor-light'} border-b flex items-center py-[7px] px-[18px] rounded-t-xl`}>
            {isAllDropDownSelect ? (
              <div ref={commentParentRef} className="flex basis-[70%] items-center">
                <Icons.comment onClick={() => setCommentFocus(true)} className="w-[18px] h-[18px] text-info-light stroke-2 shrink-0"/>
                <input
                  tabIndex={5}
                  ref={commentRef}
                  className="text-sm placeholder:text-info-light w-full border-0 bg-transparent px-2 focus:outline-0 focus:ring-0 peer-focus:bg-background-dark select-none"
                  placeholder="Add comment about what you..."
                  value={commentText}
                  onChange={(e: any) => setCommentText(e.target.value)}
                  onFocus={() => setCommentFocus(true)}
                  onBlur={() => setCommentFocus(false)}
                />
              </div>
            ) : (
              <div ref={inputParentRef} className='flex items-center basis-[70%]'>
                <Icons.search onClick={openSearch} className="w-[18px] h-[18px] text-info-light stroke-2 shrink-0"/>
                <Command.Input
                  tabIndex={1}
                  ref={inputRef}
                  className="text-sm placeholder:text-info-light w-full border-0 bg-transparent px-2 focus:outline-0 focus:ring-0 peer-focus:bg-background-dark select-none"
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
              className={`${timeErr ? 'ring-danger-light ring-1 focus:ring-danger-light focus:border-danger-light border-danger-light' : 'focus:ring-brand-light focus:border-brand-light border-borderColor-light'} border w-[60px] text-center text-sm leading-none placeholder:text-disabled-light rounded-md transition-all duration-[50] ease-out select-none focus:outline-none focus:ring-1 focus:ring-offset-0`}
              value={timeLogged}
              onChangeCapture={handleLoggedTimeInput}
            />
            <Toggle icon={<Icons.dollar className="w-6 h-6"/>} inputRef={checkobxRef} onChange={setBillable} />
            <Button
              variant="default"
              size="sm"
              type="submit"
              disabled={!canSubmit}
              tabIndex={canSubmit ? 8 : -1}
              className={`disabled:opacity-50 disabled:cursor-not-allowed bg-brand-light disabled:opacity-50 border-brand-light ml-[12px] disabled:hover:bg-brand-light px-[12px] py-[7px] border`}
            >Submit</Button>
          </div>
          <Command.List
            className={`w-[calc(100%)] ${isFocus ? 'border-brand-light' : 'border-borderColor-light'} overflow-y-auto bg-white text-content-light transition-all duration-200 ease-in overflow-y-hidden hover:overflow-y-auto ${isFocus ? 'max-h-[146px]' : 'max-h-[0]'}`}
          >
            <Command.Empty className="inline-flex items-center text-sm gap-2 p-[12px]">
              No results found.
            </Command.Empty>
            {search?.length > 0 ? renderGroup(projectArr) : renderGroup(recentlyUsedArr)}
          </Command.List>
        </Command>
      </form>

      <div className={`${isFocus ? 'border-t border-brand-light border-t-borderColor-light ' : 'border-t-0 border-borderColor-light'} flex items-center justify-between bg-info-dark py-[10px] px-5 rounded-b-xl`}>
        <div ref={dropdownRef} className="text-xs inline-flex items-center gap-x-2.5">
          <Dropdown tabIndex={2} group icon={<Icons.project className={`w-4 h-4`}/>} label="Project" options={projectList} searchable onSelected={(option : string) => handleSelectedProject(option)} defaultValue={selectedProject}/>
          <Dropdown tabIndex={3} icon={<Icons.milestone className={`w-4 h-4`}/>} label="Milestone" options={milestoneList} searchable onSelected={(option : string) => setSelectedMilestone(option)} defaultValue={selectedMilestone} disable={!selectedProject} autoOpen={!!(selectedProject && !selectedMilestone)}/>
          <Dropdown tabIndex={4} icon={<Icons.task className={`w-4 h-4`}/>} label="Task" options={taskList} searchable onSelected={(option : string) => setSelectedTask(option)} defaultValue={selectedTask} disable={!(selectedProject && selectedMilestone)} autoOpen={!!(selectedProject && selectedMilestone && !selectedTask)}/>
        </div>
        {canClear &&
          <Button
            tabIndex={9}
            variant="outline"
            onClick={handleTimeLogCancel}
            size="sm"
            type="button"
            disabled={!canClear}
            className={`bg-background-light border-borderColor-light hover:border-info-light text-content-light text-xs leading-none px-[16px] py-[8px] border focus:ring-1 focus:ring-brand-light focus:border-brand-light px-[12px] py-[7px]`}
          >Clear</Button>}
      </div>
    </div>
  );
};

export default TimeLogForm;