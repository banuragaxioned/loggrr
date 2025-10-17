import { Activity, Archive, User, User2Icon, UserCog, UserMinus, UserPen, UserRoundCheck, UserX } from "lucide-react";

export const roles = [
  {
    value: "OWNER",
    label: "Owner",
    icon: UserCog,
  },
  {
    value: "MANAGER",
    label: "Manager",
    icon: UserPen,
  },
  {
    value: "HR",
    label: "HR",
    icon: UserRoundCheck,
  },
  {
    value: "USER",
    label: "User",
    icon: User,
  },
  {
    value: "GUEST",
    label: "Guest",
    icon: UserMinus,
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    icon: UserX,
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
];

export const clientStatuses = [
  {
    value: "PUBLISHED",
    label: "Published",
    icon: Activity,
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    icon: Archive,
  },
];
