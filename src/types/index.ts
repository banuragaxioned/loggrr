import { Milestone, Task } from "@prisma/client";

export type Allocations = {
  id: number;
  date: string;
  billable: number;
  nonBillable: number;
  total: number;
};

export type Projects = {
  id: number;
  name: string;
  total: number;
  average: number;
  dates: Allocations[];
};

export type UserProfile = {
  name: string;
  id: number;
  avatar: string;
};

export type AllocationReport = {
  User: UserProfile & {
    Projects: Projects[];
    totalHours: number;
    averageHours: number;
  };
};

export type ProjectList = {
  id: number;
  projectName: string;
  clientName: string;
  milestones: {
    id: number;
    name: string;
  }[];
  tasks: {
    id: number;
    name: string;
  }[];
  billable: boolean;
  myProject: boolean;
};
