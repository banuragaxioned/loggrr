export type TimeLog = {
  data: {
    projectId: string;
    projectName: string;
    taskId?: string;
    taskName?: string;
    milestoneId: string;
    milestoneName: string;
    time: number; // in minutes
    date: string; // DD-MM-YYYY, this is today's date
    comment: string;
    billable: boolean; // default is true
  }[];
};
