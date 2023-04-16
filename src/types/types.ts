type Allocations = {
  id: number;
  date: string;
  billable: number;
  nonBillable: number;
  total: number;
};

type Projects = {
  id: number;
  name: string;
  total: number;
  average: number;
  dates: Allocations[];
};

type UserProfile = {
  name: string;
  id: number;
  avatar: string;
};

type AllocationReport = {
  User: UserProfile & {
    Projects: Projects[];
    totalHours: number;
    averageHours: number;
  };
};
