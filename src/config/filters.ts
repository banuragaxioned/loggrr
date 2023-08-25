import { Icons } from "@/components/icons";

export const statuses = [
  {
    value: "ACTIVE",
    label: "Active",
    icon: Icons.activity,
  },
  {
    value: "INACTIVE",
    label: "Archived",
    icon: Icons.archive,
  },
  {
    value: "DELETED",
    label: "Deleted",
    icon: Icons.delete,
  },
];

export const roles = [
  {
    value: "OWNER",
    label: "Owner",
    icon: Icons.user,
  },
  {
    value: "MANAGER",
    label: "Manager",
    icon: Icons.user,
  },
  {
    value: "USER",
    label: "User",
    icon: Icons.user,
  },
];

export const weekOptions = [
  { id: 0, name: "Full Week", value: "fullWeek" },
  { id: 1, name: "Work week", value: "workWeek" },
];

export const hoursTypeOptions = [
  { id: 0, name: "Billable", value: "billableTime" },
  { id: 1, name: "Non-billable", value: "nonBillableTime" },
  { id: 2, name: "All Entries", value: "allEntries" },
]

export const clientStatuses = [
  {
    value: "PUBLISHED",
    label: "Published",
    icon: Icons.activity,
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    icon: Icons.archive,
  },
];
