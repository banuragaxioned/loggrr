import type { HeaderMapping } from "json-to-csv-export";

export const reportCsvHeaders: HeaderMapping[] = [
  { key: "client", label: "Client" },
  { key: "project", label: "Project" },
  { key: "user", label: "User" },
  { key: "milestone", label: "Category" },
  { key: "task", label: "Task" },
  { key: "date", label: "Date" },
  { key: "comments", label: "Comment" },
  { key: "timeLogged", label: "Time logged" },
  { key: "billingType", label: "Billing type" },
];
