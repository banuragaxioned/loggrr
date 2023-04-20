import React, { useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectList } from "@/types/index";

export function TimeLogFormV2() {
  const [openProject, setOpenProject] = React.useState(false);
  const [openMilestone, setOpenMilestone] = React.useState(false);
  const [openTask, setOpenTask] = React.useState(false);
  const [projectList, setProjectList] = useState<ProjectList[] | undefined>([
    {
      id: 1,
      clientName: "ABC Client",
      billable: true,
      myProject: true,
      projectName: "ABC Project",
      milestones: [
        {
          id: 1,
          name: "Week 1",
        },
        {
          id: 2,
          name: "Week 2",
        },
        {
          id: 3,
          name: "Week 3",
        },
      ],
      tasks: [
        {
          id: 1,
          name: "Task 1",
        },
        {
          id: 2,
          name: "Task 2",
        },
        {
          id: 3,
          name: "Task 3",
        },
      ],
    },
    {
      id: 2,
      clientName: "XYZ Client",
      billable: true,
      myProject: true,
      projectName: "XYZ Project",
      milestones: [
        {
          id: 1,
          name: "Week 1",
        },
        {
          id: 2,
          name: "Week 2",
        },
        {
          id: 3,
          name: "Week 3",
        },
      ],
      tasks: [
        {
          id: 1,
          name: "Task 1",
        },
        {
          id: 2,
          name: "Task 2",
        },
        {
          id: 3,
          name: "Task 3",
        },
      ],
    },
    {
      id: 3,
      clientName: "PQR Client",
      billable: true,
      myProject: true,
      projectName: "PQR Project",
      milestones: [
        {
          id: 1,
          name: "Week 1",
        },
        {
          id: 2,
          name: "Week 2",
        },
        {
          id: 3,
          name: "Week 3",
        },
      ],
      tasks: [
        {
          id: 1,
          name: "Task 1",
        },
        {
          id: 2,
          name: "Task 2",
        },
        {
          id: 3,
          name: "Task 3",
        },
      ],
    },
  ]);
  const [selectedProject, setSelectedProject] = useState<number | undefined>();

  const [milestoneList, setMilestoneList] = useState<any>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<number | undefined>();

  const [taskList, setTaskList] = useState<any>([]);
  const [selectedTask, setSelectedTask] = useState<number | undefined>();

  const handleProjectSelected = (value: string) => {
    setOpenProject(false);
    console.log(value);
    setSelectedProject(Number(value));
    const project = projectList?.find((o) => o.id === Number(value));
    if (!project) {
      return;
    }

    setMilestoneList(project.milestones || []);
    setTaskList(project.tasks || []);
  };

  const handleMilestoneChange = (value: string) => {
    setOpenMilestone(false);
    console.log(value);
    setSelectedMilestone(Number(value));
  };

  const handleTaskChange = (value: string) => {
    setOpenTask(false);
    console.log(value);
    setSelectedTask(Number(value));
  };

  return (
    <>
      <div className="todo h-13 mt-4 grid grid-cols-1 gap-4 py-4">
        <div>
          <form onSubmit={(e) => console.log("Form Submitted")}>
            {selectedProject && selectedMilestone && selectedTask ? (
              <Input type="text" placeholder="e.g Comment about Task" />
            ) : (
              <div className="grid grid-cols-3 gap-4 py-4">
                <Command>
                  <Popover open={openProject} onOpenChange={setOpenProject}>
                    <PopoverTrigger>
                      <Button type="button">Project</Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-white">
                      <CommandInput placeholder="Type a command or search..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="My Projects">
                          {projectList &&
                            Array.isArray(projectList) &&
                            projectList.length &&
                            projectList.map((item, index) => {
                              return (
                                <CommandItem
                                  key={index}
                                  onSelect={(value) => {
                                    handleProjectSelected(value);
                                  }}
                                  value={item.id.toString()}
                                >
                                  {item.projectName}
                                </CommandItem>
                              );
                            })}
                        </CommandGroup>
                      </CommandList>
                    </PopoverContent>
                  </Popover>
                </Command>
                <Command>
                  <Popover open={openMilestone} onOpenChange={setOpenMilestone}>
                    <PopoverTrigger>
                      <Button type="button">Milestone</Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-white">
                      <CommandInput placeholder="Type a command or search..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Project Milestone">
                          {milestoneList &&
                            Array.isArray(milestoneList) &&
                            milestoneList.length &&
                            milestoneList.map((item, index) => {
                              return (
                                <CommandItem
                                  key={index}
                                  onSelect={(value) => {
                                    handleMilestoneChange(value);
                                  }}
                                  value={item.id.toString()}
                                >
                                  {item.name}
                                </CommandItem>
                              );
                            })}
                        </CommandGroup>
                      </CommandList>
                    </PopoverContent>
                  </Popover>
                </Command>

                <Command>
                  <Popover open={openTask} onOpenChange={setOpenTask}>
                    <PopoverTrigger>
                      <Button type="button">Tasks</Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-white">
                      <CommandInput placeholder="Type a command or search..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Project Milestone">
                          {taskList &&
                            Array.isArray(taskList) &&
                            taskList.length &&
                            taskList.map((item, index) => {
                              return (
                                <CommandItem
                                  key={index}
                                  onSelect={(value) => {
                                    handleTaskChange(value);
                                  }}
                                  value={item.id.toString()}
                                >
                                  {item.name}
                                </CommandItem>
                              );
                            })}
                        </CommandGroup>
                      </CommandList>
                    </PopoverContent>
                  </Popover>
                </Command>
              </div>
            )}

            <Button type="submit" className="my-2">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
