export type TimeLog = {
  data: {
    id: number;
    name: string;
    milestone?: {
      id: number;
      name: string;
    };
    task?: {
      id: number;
      name: string;
    };
    billable?: boolean; // default to true
    time: string; // numeric value without any unit
    comments: string;
    date: string; // yyyy-MM-dd, this is today's date
  }[];
};
